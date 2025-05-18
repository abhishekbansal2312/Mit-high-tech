"use client";

import Parallax from "@/app/components/parallax";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import noise from "../../../../public/noise.webp";
import { raleway } from "@/app/page";

const AboutContent = () => {
  const container = useRef(null);
  const isInView = useInView(container, { once: true });

  return (
    <motion.div
      ref={container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="absolute top-[10vw] sm:top-[20vw] right-[15vw] sm:right-[6vw] w-[70vw] sm:w-[53vw] h-auto z-10"
    >
      <Parallax containerRef={container} speed="sm">
        {/* TITLE */}
        <motion.h2
          animate={{
            opacity: isInView ? 1 : 0,
            y: isInView ? 0 : 20,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-2 text-title font-bold bg-gradient-to-r from-white to-brand-tertiary text-transparent bg-clip-text drop-shadow-title"
        >
          ABOUT
        </motion.h2>

        {/* BODY */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0,
            backgroundImage: `url(${noise.src})`,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`${raleway.className} p-5 md:p-10 bg-[#ffffffaa] backdrop-blur-[33px] drop-shadow-lg rounded-[16px] md:rounded-[30px]`}
        >
          <p className="text-body font-medium text-black text-justify">
            HI-TECH EVENT 2025, proudly presented by MORADABAD INSTITUTE OF TECHNOLOGY, is a vibrant fusion of technology, creativity, and intellect. This exciting event brings together students from all branches and years for a day of innovation and competition. Featuring five thrilling events - CODEATHON, IDEATHON, PROJECTATHON, DEBATE & GD, and TECHNICAL PRESENTATION - participants will showcase their skills, push creative boundaries, and collaborate with peers. Whether you&apos;re a first-year student or a graduating senior, join us at the D-Block Auditorium on May 23rd, 2025 to be part of this extraordinary celebration of technology and academic excellence.
          </p>
        </motion.div>
      </Parallax>
    </motion.div>
  );
};

export default AboutContent;