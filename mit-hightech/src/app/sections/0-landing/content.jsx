"use client";

import { easeOut, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const Content = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRulebookHovered, setIsRulebookHovered] = useState(false);

  return (
    <div className="absolute left-[8vw] top-[120px] sm:top-[14vh] xl:top-[100px] inline-block z-40">
      {/* TITLE */}
      <h1 className="text-[40px] sm:text-[8vw] font-bold leading-none drop-shadow-title">
        <motion.span
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1.01, y: 0 }}
          transition={{ duration: 1, delay: 2, ease: easeOut }}
          className="block text-gradient"
        >
          MIT
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.3, ease: easeOut }}
          className="block text-gradient"
        >
          HI-TECH
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.6, ease: easeOut }}
          className="block text-gradient"
        >
          2025
        </motion.span>
      </h1>

      {/* DATE */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3, ease: "easeOut" }}
        className="mt-5 text-[22px] md:text-[3vw] font-bold text-white drop-shadow-title"
      >
        MAY 23, 2025
      </motion.h2>

      {/* BUTTONS CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 4, ease: "easeOut" }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        {/* REGISTER BUTTON */}
        <Link
          href="https://docs.google.com/forms/d/e/1FAIpQLSfv1eaLcvfTN9NApP7IRDsdtrzjiD4ZVrhLU5xL7XT0lRbC5g/viewform?usp=sharing&ouid=106007621048068235427"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            animate={{ 
              background: isHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
              scale: isHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center justify-center font-bold text-brand-primary z-10 px-6 py-3 sm:px-4 sm:py-2 backdrop-blur-md rounded-md sm:rounded-lg border-2 border-white/20 shadow-lg hover:shadow-xl"
          >
            <span className="text-lg sm:text-2xl tracking-wider">REGISTER NOW</span>
          </motion.div>
        </Link>

        {/* RULEBOOK DOWNLOAD BUTTON */}
        <Link
          href="/rulebook.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            setIsRulebookHovered(true);
          }}
          onMouseLeave={() => setIsRulebookHovered(false)}
        >
          <motion.div
            animate={{ 
              background: isRulebookHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
              scale: isRulebookHovered ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            className="relative flex items-center justify-center font-bold text-brand-primary z-10 px-6 py-3 sm:px-4 sm:py-2 backdrop-blur-md rounded-md sm:rounded-lg border-2 border-white/20 shadow-lg hover:shadow-xl"
          >
            <span className="text-lg sm:text-2xl tracking-wider">DOWNLOAD RULEBOOK</span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default Content;