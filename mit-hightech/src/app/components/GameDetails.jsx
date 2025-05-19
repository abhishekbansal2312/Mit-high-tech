import useGame from "../hooks/useGame";
import _ from "lodash";

const GameDetails = () => {
  const { rounds, isStarted } = useGame();
  const currentRound = _.last(rounds);
  const currentScore = currentRound ? currentRound.score : 0;
  const bestScore = rounds.length > 0 ? Math.max(...rounds.map((r) => r.score)) : 0;
  
  return (
    <div className="bg-indigo-900 bg-opacity-90 rounded-lg shadow-lg p-3 relative z-30 border border-indigo-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-purple-200 text-xs uppercase font-medium tracking-wider">Score</p>
            <p className="text-white text-2xl font-bold">{currentScore}</p>
          </div>
          
          <div className="text-center">
            <p className="text-purple-200 text-xs uppercase font-medium tracking-wider">Best</p>
            <p className="text-white text-2xl font-bold">{bestScore}</p>
          </div>
          
          <div className="text-center">
            <p className="text-purple-200 text-xs uppercase font-medium tracking-wider">Played</p>
            <p className="text-white text-2xl font-bold">{rounds.length}</p>
          </div>
        </div>
        
        {!isStarted && (
          <div className="bg-indigo-700 px-3 py-2 rounded-md text-white text-sm font-medium">
            {rounds.length === 0
              ? "Tap to start!"
              : "Game over! Tap to play again."}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameDetails;