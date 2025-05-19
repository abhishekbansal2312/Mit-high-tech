"use client";

import { SignUp } from '@clerk/nextjs';
import Graphics from '@/app/sections/0-landing/graphics';
import { motion } from 'framer-motion';
import Image from 'next/image';
import logo from '../../../../public/image.png';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#211254] to-[#120a2e]">
      {/* Background graphics */}
      <div className="absolute inset-0 z-0">
        <Graphics />
      </div>
      
      {/* Content container with glass effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}

      >
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4"
          >
            <Image src={logo} alt="Logo" width={80} height={80} className="drop-shadow-glow" />
          </motion.div>
   
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60px" }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-1 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full mt-2"
          />
        </div>
        
        {/* Auth form with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
        >
          <div className="px-2 py-4">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "text-black text-center font-bold",
                  headerSubtitle: "text-black/80 text-center mb-6",
                  socialButtonsBlockButton: 
                    "bg-white/15 hover:bg-white/25 backdrop-blur-md transition-all duration-200 border border-white/20 hover:border-white/40",
                  socialButtonsBlockButtonText: "text-black font-medium",
                  socialButtonsBlockButtonIconBox: "text-black/90",
                  dividerLine: "bg-white/20",
                  dividerText: "text-black/60 px-3",
                  formFieldLabel: "text-black/90 font-medium",
                  formFieldInput: 
                    "bg-white/10 text-black border-white/10 focus:border-blue-400/70 rounded-lg placeholder:text-black/40 backdrop-blur-sm transition-all duration-200",
                  formButtonPrimary: 
                    "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-black font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/30",
                  footerActionText: "text-black/90",
                  footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                  identityPreviewText: "text-black",
                  identityPreviewEditButtonIcon: "text-blue-400",
                  alertText: "text-black/90",
                  poweredByText: "text-black/90",
                  otpCodeFieldInput: "text-black bg-white/10 border-white/20",
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "iconButton"
                }
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              redirectUrl="/"
            />
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute -z-10 w-80 h-80 rounded-full bg-purple-500/20 blur-[100px] -top-20 -right-20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute -z-10 w-80 h-80 rounded-full bg-blue-500/20 blur-[100px] -bottom-40 -left-20"
        />
      </motion.div>
    </div>
  );
}