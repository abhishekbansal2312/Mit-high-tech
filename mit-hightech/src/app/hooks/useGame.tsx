import _ from "lodash";
import React, { useEffect, useCallback } from "react";
import { useImmer } from "use-immer";
import { TargetAndTransition } from "framer-motion";
import { WritableDraft } from "immer";
import { v4 } from "uuid";
import { useUser } from "@clerk/nextjs";

const HEIGHT = 64;
const WIDTH = 92;
const FRAMES = ["0px", "92px", "184px", "0px"];
const defaultState = {
  bird: {
    position: { x: 0, y: 0 },
    size: { width: WIDTH, height: HEIGHT },
    animate: {},
    frame: FRAMES[0],
    frameIndex: 0,
    initial: {
      x: 0,
      y: 0,
    },
    isFlying: true,
    fall: { distance: 15, delay: 100 },
    fly: { distance: 75 },
    flap: {
      delay: 100,
    },
  },
  pipes: Array(4)
    .fill("")
    .map((_, index) => ({
      top: {
        key: "top" + index,
        position: { x: 0, y: 0 },
        initial: {
          x: 0,
          y: 0,
        },
        size: { width: 0, height: 0 },
      },
      bottom: {
        key: "bottom" + index,
        position: { x: 0, y: 0 },
        initial: {
          x: 0,
          y: 0,
        },
        size: { width: 0, height: 0 },
      },
    })),
  pipe: {
    width: 0,
    height: 0,
    extension: 0,
    tolerance: 25,
    distance: 10,
    delay: 75,
  },
  rounds: [],
  isStarted: false,
  isReady: true,
  window: {
    width: 0,
    height: 0,
  },
  multiplier: {
    distance: 1.1,
    step: 5,
  },
  highScore: 0,
  username: 'Anonymous Player',
  isGameOver: false,
  scoresFetched: false // Add a flag to track if scores have been fetched
};

type Size = {
  width: number;
  height: number;
};
type Coordinates = {
  x: number;
  y: number;
};

export type PipeType = {
  position: Coordinates;
  initial: Coordinates;
  size: Size;
  key?: string;
};
export type PipesType = {
  top: PipeType;
  bottom: PipeType;
};
interface GameContext extends GameState {
  getNextFrame: () => void;
  fly: () => void;
  fall: () => void;
  handleWindowClick: () => void;
  movePipes: () => void;
  startGame: (window: Size) => void;
  saveScore: (score: number) => Promise<void>;
}
interface GameState {
  bird: {
    position: Coordinates;
    size: Size;
    animate: TargetAndTransition;
    frame: string;
    frameIndex: number;
    initial: Coordinates;
    isFlying: boolean;
    fall: {
      distance: number;
      delay: number;
    };
    fly: {
      distance: number;
    };
    flap: {
      delay: number;
    };
  };
  pipes: PipesType[];
  pipe: {
    width: number;
    height: number;
    extension: number;
    delay: number;
    distance: number;
    tolerance: number;
  };
  rounds: {
    score: number;
    datetime: string;
    key: string;
    needsSaving?: boolean;
  }[];
  isStarted: boolean;
  isReady: boolean;
  window: Size;
  multiplier: {
    step: number;
    distance: number;
  };
  highScore: number;
  username: string;
  isGameOver: boolean;
  scoresFetched: boolean; // Add this to GameState interface
}
type StateDraft = WritableDraft<GameState>;
const GameContext = React.createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useImmer<GameState>(defaultState);
  const { user, isSignedIn } = useUser();
  
  // Fetch user's high score on component mount
  const fetchUserScore = useCallback(async () => {
    if (!isSignedIn) return;
    
    try {
      setState(draft => {
        draft.scoresFetched = false; // Set fetching flag
      });
      
      const response = await fetch('/api/user-score', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user score');
      }
      
      const data = await response.json();
      
      setState(draft => {
        if (data.success && data.score) {
          draft.highScore = data.score.score;
          draft.username = data.score.username || user?.username || 'Anonymous Player';
        }
        draft.scoresFetched = true; // Mark fetching as complete
      });
    } catch (error) {
      console.error('Error fetching user score:', error);
      setState(draft => {
        draft.scoresFetched = true; // Mark as complete even on error
      });
    }
  }, [isSignedIn, user, setState]);
  
  useEffect(() => {
    if (isSignedIn && !state.scoresFetched) {
      fetchUserScore();
    }
  }, [isSignedIn, fetchUserScore, state.scoresFetched]);
  
  // Save score to database
  const saveScore = async (score: number) => {
    if (!isSignedIn) return;
    
    try {
      const username = user?.username || user?.firstName || 'Anonymous Player';
      
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score,
          username
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save score');
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Score saved successfully');
        
        // Update local high score if the new score is higher
        if (score > state.highScore) {
          setState(draft => {
            draft.highScore = score;
          });
        }
      }
    } catch (error) {
      console.error('Error saving score:', error);
      throw error; // Re-throw the error so the caller can handle it
    }
  };
  
  // Main Functions
  const startGame = (window: Size) => {
    setState((draft) => {
      draft.window = window;
      draft.isReady = true;
      draft.isGameOver = false;
      setBirdCenter(draft);
      createPipes(draft);
      return draft;
    });
  };
  
  const increaseScore = (draft: StateDraft) => {
    draft.rounds[draft.rounds.length - 1].score += 1;
  };
  
  const multiplySpeed = (draft: StateDraft) => {
    const round = _.last(draft.rounds);
    if (round && round.score % draft.multiplier.step === 0) {
      draft.pipe.distance = draft.pipe.distance * draft.multiplier.distance;
    }
  };
  
  // Pipe Functions
  const generatePipeExtension = (index: number, draft: StateDraft) => {
    const odd = _.random(0, 1) === 1;
    const randomNumber = _.random(odd ? 0.5 : 0, odd ? 1 : 0, true);
    const extension = randomNumber * draft.pipe.extension;
    return {
      height: draft.pipe.height + extension,
      y: draft.window.height - draft.pipe.height + extension,
    };
  };
  
  const createPipes = (draft: StateDraft) => {
    const window = draft.window;
    draft.pipe.width = window.width / draft.pipes.length;
    draft.pipe.height = (2/7) * window.height;
    draft.pipe.distance = defaultState.pipe.distance;
    draft.pipe.extension = (0.5 / 3) * window.height;
    draft.pipes.forEach((pipe, index) => {
      const { height, y } = generatePipeExtension(index, draft);
      var x = (index * 2 + 1) * draft.pipe.width + window.width;
      pipe.top.initial = {
        x,
        y: 0,
      };
      pipe.top.size = {
        height,
        width: draft.pipe.width,
      };
      pipe.bottom.initial = {
        x,
        y,
      };
      pipe.bottom.size = {
        height,
        width: draft.pipe.width,
      };
      pipe.top.position = pipe.top.initial;
      pipe.bottom.position = pipe.bottom.initial;
    });
  };
  
  const movePipes = () => {
    setState((draft) => {
      draft.pipes.forEach((pipe, index) => {
        if (pipe.top.position.x + pipe.top.size.width * 2 <= 0) {
          const { height, y } = generatePipeExtension(index, draft);
          pipe.top.position.x = draft.pipe.width * 2 + draft.window.width;
          pipe.bottom.position.x = draft.pipe.width * 2 + draft.window.width;
          pipe.top.size.height = height;
          pipe.bottom.size.height = height;
          pipe.bottom.position.y = y;
          pipe.top.key = v4();
          pipe.bottom.key = v4();
          increaseScore(draft);
          multiplySpeed(draft);
        }
        pipe.top.position.x -= draft.pipe.distance;
        pipe.bottom.position.x -= draft.pipe.distance;
      });

      return draft;
    });
  };
  
  // Window Functions
  const handleWindowClick = () => {
    if (state.isStarted) {
      fly();
    } else {
      setState((draft) => {
        draft.isStarted = true;
        draft.isGameOver = false;
        draft.rounds.push({
          score: 0,
          datetime: new Date().toISOString(),
          key: v4(),
        });
        draft.bird.isFlying = true;
        setBirdCenter(draft);
        createPipes(draft);
        return draft;
      });
    }
  };
  
  // Bird Functions
  const setBirdCenter = (draft: StateDraft) => {
    draft.bird.position.x = draft.window.width / 2 - draft.bird.size.width / 2;
    draft.bird.position.y =
      draft.window.height / 2 - draft.bird.size.height / 2;
    draft.bird.initial.x = draft.bird.position.x;
    draft.bird.initial.y = draft.bird.position.y;
  };
  
  const getNextFrame = () =>
    setState((draft) => {
      var next = (draft.bird.frameIndex + 1) % FRAMES.length;
      draft.bird.frame = FRAMES[next];
      draft.bird.frameIndex = next;
      return draft;
    });
    
  const checkImpact = (draft: StateDraft) => {
    const groundImpact =
      draft.bird.position.y + draft.bird.size.height >=
      draft.window.height + draft.pipe.tolerance;
    const impactablePipes = draft.pipes.filter((pipe) => {
      return (
        pipe.top.position.x <
          draft.bird.position.x -
            draft.pipe.tolerance +
            draft.bird.size.width &&
        pipe.top.position.x + pipe.top.size.width >
          draft.bird.position.x + draft.pipe.tolerance
      );
    });
    const pipeImpact = impactablePipes.some((pipe) => {
      const topPipe = pipe.top.position.y + pipe.top.size.height;
      const bottomPipe = pipe.bottom.position.y;
      const birdTop = draft.bird.position.y + draft.pipe.tolerance;
      const birdBottom =
        draft.bird.position.y + draft.bird.size.height - draft.pipe.tolerance;
      return birdTop < topPipe || birdBottom > bottomPipe;
    });
    
    if (groundImpact || pipeImpact) {
      draft.bird.isFlying = false;
      draft.isStarted = false;
      draft.isGameOver = true;
      draft.bird.animate.rotate = [0, 540];
      
      // Get current score to save
      const currentRound = draft.rounds[draft.rounds.length - 1];
      if (currentRound) {
        const currentScore = currentRound.score;
        
        // We'll call saveScore outside of the setState function
        // but store a flag to know we need to save this score
        draft.rounds[draft.rounds.length - 1].needsSaving = true;
      }
    } else {
      draft.bird.animate.rotate = [0, 0];
    }
  };

  // Effect to save score when game ends
  useEffect(() => {
    const currentRound = _.last(state.rounds);
    if (state.isGameOver && currentRound && currentRound.needsSaving) {
      saveScore(currentRound.score).catch(err => {
        console.error('Failed to save score in effect:', err);
      });
      
      // Clear the flag
      setState(draft => {
        const lastRound = _.last(draft.rounds);
        if (lastRound) {
          lastRound.needsSaving = false;
        }
      });
    }
  }, [state.isGameOver, state.rounds]);

  const fly = () => {
    setState((draft) => {
      draft.bird.isFlying = true;
      draft.bird.position.y -= draft.bird.fly.distance;
      checkImpact(draft);
      return draft;
    });
  };

  const fall = () => {
    setState((draft) => {
      draft.bird.isFlying = true;
      draft.bird.position.y += draft.bird.fall.distance;
      checkImpact(draft);
      return draft;
    });
  };
  
  return (
    <GameContext.Provider
      value={{
        ...state,
        getNextFrame,
        fall,
        fly,
        handleWindowClick,
        movePipes,
        startGame,
        saveScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default function useGame() {
  const context = React.useContext(GameContext);
  if (context === null) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}