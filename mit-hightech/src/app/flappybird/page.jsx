'use client';
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FlappyBird from "../components/FlappyBird";
import useGame, { GameProvider } from "../hooks/useGame";
import Pipes from "../components/Pipes";
import useElementSize from "../hooks/useElementSize";
import _ from "lodash";
import GameDetails from "../components/GameDetails";
import Graphics from "../sections/0-landing/graphics";
import Graphics2 from "../sections/4-director/graphics";
import useWindowSize from "../hooks/useWindowSize";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Inner component that requires the Game context
function GameContent() {
  const { handleWindowClick, startGame, isReady } = useGame();
  const { height } = useWindowSize();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const gameHeight = Math.min(Math.max(height * 0.6, 400), 600);
  const [ref, size] = useElementSize();
  const [showRefreshTip, setShowRefreshTip] = useState(true);

  useEffect(() => {
    // Redirect to sign-up if not authenticated
    if (isLoaded && !isSignedIn) {
      router.push("/sign-up");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (size.width > 0 && size.height > 0) {
      startGame(size);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]); // Intentionally omitting startGame from dependencies
  
  // Auto-hide refresh tip after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRefreshTip(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading state or nothing while checking authentication
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800">
        <div className="p-6 bg-indigo-800 bg-opacity-90 rounded-lg shadow-lg text-white border border-indigo-700">
          <h2 className="text-xl font-bold mb-2 text-center">Loading game...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-full pb-20 min-h-screen relative overflow-hidden">
      {/* Background gradient that fills the entire screen */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-800 z-0"></div>
      
      {/* Graphics positioned with proper z-index */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Graphics />
      </div>
      
      {/* Back to Home button */}
      <div className="z-50 max-w-48">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-white bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors duration-300 border border-indigo-500"
          >
            <span>⬅</span>
            <span>Back to Home</span>
          </motion.div>
        </Link>
      </div>
      
      <div className="container max-w-5xl mx-auto flex items-center justify-center flex-col md:flex-row gap-6 relative z-20">
        {/* Game info section */}
        <div className="w-full md:w-1/3 flex flex-col">
          <div className="bg-indigo-800 bg-opacity-90 p-4 rounded-lg shadow-md text-white border border-indigo-700">
            <h2 className="text-xl font-bold mb-2 text-purple-200">How to Play</h2>
            <p className="text-purple-100">Click or tap anywhere on the game screen to make the bird fly.</p>
            <p className="mt-2 text-purple-100">Avoid the pipes and don&apos;t hit the ground!</p>
            <p className="mt-2 text-purple-100">Every pipe you pass increases your score.</p>
            <p className="mt-2 text-purple-100">The game gets faster as your score increases.</p>
            
            {/* Refresh tip message */}
            {showRefreshTip && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-2 bg-indigo-700 rounded-md border border-indigo-500"
              >
                <p className="text-purple-100 font-medium">
                  Note: If the bird or game elements aren&apos;t visible, please try refreshing the page.
                </p>
                <button 
                  onClick={() => setShowRefreshTip(false)}
                  className="text-xs text-purple-300 mt-1 underline"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </div>
          <div className="mb-4 mt-4 w-full">
            <GameDetails />
          </div>
        </div>
        
        {/* Game area */}
        <motion.main
          layout
          className="w-full md:w-2/3 overflow-hidden z-30 rounded-xl flex flex-col mx-auto shadow-lg relative h-[60vh] min-h-[400px] max-h-[600px] max-w-[480px]"
          style={{ height: `${gameHeight}px` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500 to-purple-800 opacity-30 z-10"></div>
          
          {/* Game graphics */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <Graphics2 />
          </div>
          
          <motion.div
            ref={ref}
            onTap={handleWindowClick}
            className="h-full w-full z-30 flex relative overflow-hidden cursor-pointer"
          >
            {isReady && (
              <>
                <Pipes />
                <FlappyBird />
              </>
            )}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

// Exported Game component wraps everything in the context provider
export default function Game() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}