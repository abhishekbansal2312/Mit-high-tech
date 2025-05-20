"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Raleway } from "next/font/google";
import { Calendar, Trophy, Play, Star } from "lucide-react";

const raleway = Raleway({
  subsets: ["latin"],
  weight: "variable",
});

const FlappyBirdPromo = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className={`w-full flex justify-center px-4 sm:px-6 mb-8 sm:mb-16  ${raleway.className}`}>
      <div className="max-w-5xl w-full mx-auto bg-gradient-to-br from-blue-800 to-purple-900 backdrop-blur-md rounded-lg sm:rounded-2xl border border-white/10 shadow-xl sm:shadow-2xl overflow-hidden">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-3 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 fill-yellow-300" />
            <h3 className="font-bold text-sm sm:text-base text-white">EXCLUSIVE EVENT</h3>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-white/80">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Limited Time Offer</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {/* Content section - 3 columns on medium screens and up */}
          <div className="md:col-span-3 space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1 sm:mb-2 tracking-tight">
                FLAPPY BIRD <span className="text-yellow-400">CHALLENGE</span>
              </h2>
              <p className="text-blue-200 text-base sm:text-lg">
                Test your skills in our exclusive game event
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600/30 p-1.5 sm:p-2 rounded-lg">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-white">Win Prizes</h4>
                  <p className="text-white/70 text-xs sm:text-sm">Top performer will earn exclusive rewards and recognition</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-600/30 p-1.5 sm:p-2 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-white">Limited-Time Event</h4>
                  <p className="text-white/70 text-xs sm:text-sm">Dont miss your chance to participate in this special competition</p>
                </div>
              </div>
            </div>
          </div>

          {/* Game preview - 2 columns on medium screens and up */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-blue-900 to-purple-800 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10 shadow-md sm:shadow-lg h-full flex flex-col">
              <div className="flex-1 flex justify-center items-center mb-4 sm:mb-6 relative">
       
                
            
              </div>

              {isSignedIn ? (
                <Link href="/flappybird" className="block w-full">
                  <button
                    className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-lg font-bold text-base sm:text-lg shadow-lg flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>PLAY NOW</span>
                  </button>
                </Link>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 sm:p-3">
                    <p className="text-yellow-300 text-center font-medium text-xs sm:text-sm">
                      Sign up to unlock the game and compete for prizes!
                    </p>
                  </div>
                  <Link href="/sign-up" className="block w-full">
                    <button
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-lg font-bold text-base sm:text-lg shadow-lg"
                    >
                      SIGN UP NOW
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/30 px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/70 text-xs sm:text-sm">
              Compete with college mates • Instant leaderboards updates
            </p>
            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
              <p className="text-yellow-400 font-medium text-xs sm:text-sm">
                Top scores win exclusive prizes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBirdPromo;