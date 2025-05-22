import _ from "lodash";
import React, { useEffect, useCallback, useRef } from "react";  // Added useRef
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
    tolerance: 20, // Increased tolerance for more forgiving collision
    distance: 10,
    delay: 75,
    gap: 200, // Increased gap even more
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
  username: '',
  isGameOver: false,
  scoresFetched: false, // Add a flag to track if scores have been fetched
  pendingFly: false // NEW: Add a flag to track pending fly actions
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
    gap: number; // Add gap to interface
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
  scoresFetched: boolean; 
  pendingFly: boolean; // NEW: Add to GameState interface
}
type StateDraft = WritableDraft<GameState>;
const GameContext = React.createContext<GameContext | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useImmer<GameState>(defaultState);
  const { user, isSignedIn } = useUser();
  
  // Improved debounce/throttling mechanisms
  const lastClickTime = useRef<number>(0);
  const clickInProgressRef = useRef<boolean>(false);
  const CLICK_DEBOUNCE_MS = 150; // Increased from 100ms to 150ms for better debouncing
  
  // Improved throttling with animation frame for smoother experience
  const throttledFly = useRef<() => void>();
  
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
          draft.username = data.score.username || user?.username;
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
      const username = user?.username || user?.firstName;

      if (score > state.highScore) {
        setState(draft => {
          draft.highScore = score;
        });
      }

      // Removed database saving logic
      console.log(`Score (${score}) for ${username} not saved to the database (local update only).`);

    } catch (error) {
      console.error('Error updating score locally:', error);
      throw error;
    }
  };
  
  
  // Main Functions
  const startGame = (window: Size) => {
    setState((draft) => {
      draft.window = window;
      draft.isReady = true;
      draft.isGameOver = false;
      draft.pendingFly = false; // Reset pendingFly flag
      setBirdCenter(draft);
      createPipes(draft);
      return draft;
    });
  };
  
  const increaseScore = (draft: StateDraft) => {
    draft.rounds[draft.rounds.length - 1].score += 10;
  };
  
  const multiplySpeed = (draft: StateDraft) => {
    const round = _.last(draft.rounds);
    if (round && round.score % draft.multiplier.step === 0) {
      // Only increase speed if the score is below 35
      if (round.score < 27) {
        draft.pipe.distance = draft.pipe.distance * draft.multiplier.distance;
      }
    }
  };
  
  // Pipe Functions - FIXED VERSION
  const generatePipeHeight = (draft: StateDraft) => {
    // Generate a random height for the top pipe with more reasonable bounds
    const minHeight = 80; // Increased minimum height
    const maxHeight = draft.window.height - draft.pipe.gap - 80; // More space
    const topPipeHeight = _.random(minHeight, maxHeight);
    
    return {
      topHeight: topPipeHeight,
      bottomY: topPipeHeight + draft.pipe.gap,
      bottomHeight: draft.window.height - (topPipeHeight + draft.pipe.gap)
    };
  };
  
  const createPipes = (draft: StateDraft) => {
    const window = draft.window;
    draft.pipe.width = window.width / 6; // Make pipes a bit narrower
    draft.pipe.gap = 220; // Increased gap between pipes
    draft.pipe.distance = defaultState.pipe.distance;
    
    draft.pipes.forEach((pipe, index) => {
      const { topHeight, bottomY, bottomHeight } = generatePipeHeight(draft);
      const x = (index + 1) * (window.width / 2) + window.width; // Better spacing
      
      // Top pipe
      pipe.top.initial = {
        x,
        y: 0,
      };
      pipe.top.size = {
        height: topHeight,
        width: draft.pipe.width,
      };
      pipe.top.position = { ...pipe.top.initial };
      
      // Bottom pipe
      pipe.bottom.initial = {
        x,
        y: bottomY,
      };
      pipe.bottom.size = {
        height: bottomHeight,
        width: draft.pipe.width,
      };
      pipe.bottom.position = { ...pipe.bottom.initial };
    });
  };
  
  // FIXED movePipes function
  const movePipes = () => {
    setState((draft) => {
      draft.pipes.forEach((pipe, index) => {
        // Check if pipe has completely moved off screen
        if (pipe.top.position.x + pipe.top.size.width < 0) {
          // Find the rightmost pipe to position this one after it
          let maxX = 0;
          draft.pipes.forEach(otherPipe => {
            if (otherPipe !== pipe) {
              maxX = Math.max(maxX, otherPipe.top.position.x);
            }
          });
          
          // Generate new pipe heights
          const { topHeight, bottomY, bottomHeight } = generatePipeHeight(draft);
          
          // Position the pipe after the rightmost pipe
          const newX = maxX + (draft.window.width / 2);
          
          // Update top pipe
          pipe.top.position.x = newX;
          pipe.top.position.y = 0;
          pipe.top.size.height = topHeight;
          pipe.top.size.width = draft.pipe.width;
          pipe.top.key = v4();
          
          // Update bottom pipe
          pipe.bottom.position.x = newX;
          pipe.bottom.position.y = bottomY;
          pipe.bottom.size.height = bottomHeight;
          pipe.bottom.size.width = draft.pipe.width;
          pipe.bottom.key = v4();
          
          // Increase score and speed
          increaseScore(draft);
          multiplySpeed(draft);
        }
        
        // Move pipes to the left
        pipe.top.position.x -= draft.pipe.distance;
        pipe.bottom.position.x -= draft.pipe.distance;
      });

      return draft;
    });
  };
  
  // Window Functions
  const handleWindowClick = () => {
    const now = Date.now();
    
    // Ignore clicks that happen too soon after the previous click
    if (now - lastClickTime.current < CLICK_DEBOUNCE_MS) {
      return;
    }
    
    // Update last click time
    lastClickTime.current = now;
    
    // If game is not started, start it
    if (!state.isStarted) {
      setState((draft) => {
        draft.isStarted = true;
        draft.isGameOver = false;
        draft.rounds.push({
          score: 0,
          datetime: new Date().toISOString(),
          key: v4(),
        });
        draft.bird.isFlying = true;
        draft.pendingFly = false; // Reset pendingFly flag
        setBirdCenter(draft);
        createPipes(draft);
        return draft;
      });
      return;
    }
    
    // Only fly if the game is started and not game over
    if (state.isStarted && !state.isGameOver && state.bird.isFlying) {
      // Use requestAnimationFrame to synchronize with the rendering cycle
      if (!clickInProgressRef.current) {
        clickInProgressRef.current = true;
        
        requestAnimationFrame(() => {
          fly();
          
          // Release the click lock after a delay
          setTimeout(() => {
            clickInProgressRef.current = false;
          }, CLICK_DEBOUNCE_MS / 2);
        });
      }
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
    
  // COMPLETELY FIXED collision detection
  const checkImpact = (draft: StateDraft) => {
    // Check ground collision - bird bottom touches ground
    const groundImpact = draft.bird.position.y + draft.bird.size.height >= draft.window.height;
    
    // Check ceiling collision - bird top touches ceiling
    const ceilingImpact = draft.bird.position.y <= 0;
    
    // Find pipes that overlap horizontally with the bird
    const impactablePipes = draft.pipes.filter((pipe) => {
      const pipeLeft = pipe.top.position.x;
      const pipeRight = pipe.top.position.x + pipe.top.size.width;
      const birdLeft = draft.bird.position.x;
      const birdRight = draft.bird.position.x + draft.bird.size.width;
      
      // Only check pipes that actually overlap horizontally with the bird
      return birdRight > pipeLeft && birdLeft < pipeRight;
    });
    
    // Check pipe collision ONLY for pipes that overlap horizontally
    const pipeImpact = impactablePipes.some((pipe) => {
      // Apply tolerance to make the bird's collision box smaller
      const birdTop = draft.bird.position.y + draft.pipe.tolerance;
      const birdBottom = draft.bird.position.y + draft.bird.size.height - draft.pipe.tolerance;
      const birdLeft = draft.bird.position.x + draft.pipe.tolerance;
      const birdRight = draft.bird.position.x + draft.bird.size.width - draft.pipe.tolerance;
      
      // Check if bird (with tolerance) overlaps horizontally with pipe
      const horizontalOverlap = birdRight > pipe.top.position.x && birdLeft < pipe.top.position.x + pipe.top.size.width;
      
      if (!horizontalOverlap) {
        return false; // No horizontal overlap, no collision
      }
      
      // Top pipe collision - bird's top hits the bottom of top pipe
      const topPipeBottom = pipe.top.position.y + pipe.top.size.height;
      const hitTopPipe = birdTop <= topPipeBottom;
      
      // Bottom pipe collision - bird's bottom hits the top of bottom pipe
      const bottomPipeTop = pipe.bottom.position.y;
      const hitBottomPipe = birdBottom >= bottomPipeTop;
      
      return hitTopPipe || hitBottomPipe;
    });
    
    if (groundImpact || ceilingImpact || pipeImpact) {
      draft.bird.isFlying = false;
      draft.isStarted = false;
      draft.isGameOver = true;
      draft.pendingFly = false; // Reset pendingFly on game over
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

  // Improved fly function with state handling
  const fly = () => {
    setState((draft) => {
      if (draft.isStarted && draft.bird.isFlying) {
        // Only fly if we're not already handling a fly action
        if (!draft.pendingFly) {
          draft.pendingFly = true;
          draft.bird.position.y -= draft.bird.fly.distance;
          checkImpact(draft);
          
          // Schedule resetting pendingFly flag after a short delay
          // This happens outside the setState to avoid nested setState issues
          setTimeout(() => {
            setState(innerDraft => {
              innerDraft.pendingFly = false;
              return innerDraft;
            });
          }, CLICK_DEBOUNCE_MS / 2);
        }
      }
      return draft;
    });
  };

  const fall = () => {
    setState((draft) => {
      if (draft.bird.isFlying) {
        draft.bird.position.y += draft.bird.fall.distance;
        checkImpact(draft);
      }
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