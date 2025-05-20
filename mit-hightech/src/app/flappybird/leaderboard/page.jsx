'use client';
import React, { useEffect } from 'react';
import Leaderboard from '../../components/Leaderboard';
import Link from 'next/link';
import Graphics from '../../sections/7-footer/graphics';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const { isSignedIn, isLoaded } = useAuth();



  // Determine back link based on authentication status
  const backLink = isSignedIn ? '/flappybird' : '/';
  const backText = isSignedIn ? 'Back to Game' : 'Back to Home';

  return (
    <div className="relative min-h-screen text-white p-6 overflow-hidden flex flex-col items-center justify-start">
      
      {/* Background graphics */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Graphics />
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-5xl mt-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href={backLink}
            className="text-blue-400 hover:text-purple-400 transition duration-300 text-lg font-semibold"
          >
            ⬅ {backText}
          </Link>

          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center flex-1">
            Flappy Bird Leaderboard
          </h1>

          {/* Spacer to balance layout */}
          <div className="w-32 md:w-40" />
        </div>

        {/* Leaderboard content */}
        <div className="backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6 border border-blue-500/30">
          {isLoaded ? (
            <Leaderboard />
          ) : (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-lg text-blue-300">Loading leaderboard...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}