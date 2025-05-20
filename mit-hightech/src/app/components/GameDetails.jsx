import _ from "lodash";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import useGame from "../hooks/useGame";

const GameDetails = () => {
  const { rounds, isStarted, highScore, scoresFetched } = useGame();
  const { user, isSignedIn } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const currentRound = _.last(rounds);
  const currentScore = currentRound ? currentRound.score : 0;
  // Calculate best score from both current rounds and fetched high score
  const bestScoreFromRounds = rounds.length > 0 ? Math.max(...rounds.map((r) => r.score)) : 0;
  const bestScore = Math.max(bestScoreFromRounds, highScore);
  const isGameOver = !isStarted && rounds.length > 0;
  
  // Auto-save score when game ends and score is higher than previous best
  useEffect(() => {
    if (isGameOver && isSignedIn && currentScore > highScore && !saved && currentScore > 0) {
      saveScore();
    }
  }, [isGameOver, currentScore, highScore, isSignedIn, saved]);
  
  // Auto-save even if it's not better than the all-time high but better than recent rounds
  useEffect(() => {
    if (isGameOver && isSignedIn && currentScore > bestScoreFromRounds && currentScore !== highScore && !saved && currentScore > 0) {
      saveScore();
    }
  }, [isGameOver, currentScore, bestScoreFromRounds, highScore, isSignedIn, saved]);
  
  // Reset saved state when game starts
  useEffect(() => {
    if (isStarted) {
      setSaved(false);
    }
  }, [isStarted]);
  
  const saveScore = async () => {
    if (!isSignedIn || !isGameOver || currentScore === 0) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: currentScore,
          username: user?.username || user?.firstName
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save score');
      }
      
      setSaved(true);
    } catch (err) {
      console.error('Error saving score:', err);
      setError('Failed to save your score. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-indigo-900 bg-opacity-90 rounded-lg shadow-lg p-4 relative z-30 border border-indigo-700">
      <div className="flex flex-col gap-3">
        {/* Scores and game status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-purple-200 text-xs uppercase font-medium tracking-wider">Score</p>
              <p className="text-white text-2xl font-bold">{currentScore}</p>
            </div>
            
            <div className="text-center">
              <p className="text-purple-200 text-xs uppercase font-medium tracking-wider">Best</p>
              <p className="text-white text-2xl font-bold">
                {scoresFetched || !isSignedIn ? bestScore : "..."}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            {!isStarted && (
              <div className="bg-indigo-700 px-4 py-2 rounded-md text-white text-sm font-medium">
                {rounds.length === 0
                  ? "Tap to start!"
                  : "Game over! Tap to play again."}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons and status */}
        <div className="flex items-center justify-between">
          <Link 
            href="/flappybird/leaderboard" 
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors"
          >
            View Leaderboard
          </Link>
          
          <div className="flex flex-col items-end">
            {isGameOver && currentScore > 0 && isSignedIn && (
              <>
                {isSaving ? (
                  <div className="bg-indigo-500 px-4 py-2 rounded text-white text-sm font-medium">
                    Auto-saving...
                  </div>
                ) : saved ? (
                  <div className="bg-green-600 px-4 py-2 rounded text-white text-sm font-medium">
                    Score saved!
                  </div>
                ) : (
                  <div className="bg-yellow-600 px-4 py-2 rounded text-white text-sm font-medium">
                    Score not saved
                  </div>
                )}
                
                {error && <div className="mt-1 text-red-300 text-xs">{error}</div>}
              </>
            )}
            
            {isGameOver && currentScore > 0 && !isSignedIn && (
              <Link 
                href="/sign-in" 
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white text-sm font-medium transition-colors"
              >
                Sign in to save score
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;