import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();
        setScores(data?.scores || []);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <div className="animate-bounce text-4xl mb-2">🚀</div>
          <p className="text-purple-300 text-lg font-medium">Loading scores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-600 bg-opacity-20 p-4 rounded-lg text-center border border-red-400">
        <p className="text-red-300 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="]">


      {scores.length === 0 ? (
        <p className="text-center text-gray-300">No scores yet. Be the first to play!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-4 text-blue-300 text-sm uppercase">Rank</th>
                <th className="px-4 text-blue-300 text-sm uppercase">Player</th>
                <th className="px-4 text-right text-blue-300 text-sm uppercase">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => {
                const isCurrentUser = isLoaded && user && score.userId === user.id;
                const rankStyle =
                  index === 0
                    ? 'bg-yellow-400/20 text-yellow-300'
                    : index === 1
                    ? 'bg-gray-400/20 text-gray-200'
                    : index === 2
                    ? 'bg-orange-400/20 text-orange-300'
                    : 'bg-white/10 text-white';

                return (
                  <tr
                    key={index}
                    className={`rounded-md ${rankStyle} ${
                      isCurrentUser ? 'ring-2 ring-blue-500/50' : ''
                    }`}
                  >
                    <td className="py-2 px-4 rounded-l-lg font-semibold">{index + 1}</td>
                    <td className="py-2 px-4 font-medium flex items-center gap-2">
                      {score.username}
                      {isCurrentUser && (
                        <span className="text-xs text-blue-300 font-semibold">(You)</span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-right rounded-r-lg">{score.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
