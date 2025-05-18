"use client";

import { motion, useInView } from "framer-motion";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useRef } from "react";
import Link from "next/link";

import noise from "../../../../public/noise.webp";

const raleway = Raleway({
  subsets: ["latin"],
  weight: "variable",
});

// Data for maintainers
const maintainersData = [
  {
    "name": "Shashwat Shinghal",
    "year": "3rd year BTech",
    "image": "/images/maintainers/shashwat.png", // Replace with actual image path
    "linkedin": "https://www.linkedin.com/in/shashwat-shinghal-4a8a6524a/" // Replace with actual LinkedIn URL
  },
  {
    "name": "Abhishek Bansal",
    "year": "4th year BTech",
    "image": "/images/maintainers/abhishek.png", // Replace with actual image path
    "linkedin": "https://www.linkedin.com/in/abhishek-bansal-03ba6b267" // Replace with actual LinkedIn URL
  },
  {
    "name": "Baljeet Singh",
    "year": "3rd year BTech",
    "image": "/images/maintainers/baljeet.png", // Replace with actual image path
    "linkedin": "https://www.linkedin.com/in/baljeet-singh-2361b1260/" // Replace with actual LinkedIn URL
  }
];

const Content = () => {
  const container = useRef(null);
  const isInView = useInView(container, { once: true });
  
  return (
    <div ref={container} className="w-[75vw] h-fit mx-auto z-10">
      <motion.h2
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 20,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="mb-2 text-title font-bold bg-gradient-to-r from-white to-brand-tertiary text-transparent bg-clip-text drop-shadow-title"
      >
        Site Developers
      </motion.h2>
      
      <motion.div
        animate={{
          opacity: isInView ? 1 : 0,
          backgroundImage: `url(${noise.src})`,
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`${raleway.className} p-5 md:p-10 bg-[#ffffffaa] backdrop-blur-[33px] drop-shadow-lg rounded-[16px] md:rounded-[30px] flex flex-wrap justify-center gap-8 md:gap-16`}
      >
        {maintainersData.map((maintainer, i) => (
          <Maintainer key={i} maintainer={maintainer} />
        ))}
      </motion.div>
    </div>
  );
};

const Maintainer = ({ maintainer }) => {
  return (
    <motion.div 
      className="flex flex-col items-center"
      whileHover={{
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      {/* Circular Profile Image with Gradient Border */}
      <Link href={maintainer.linkedin} target="_blank" rel="noopener noreferrer">
        <div className="rounded-full p-[3px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary shadow-lg">
          <div className="rounded-full size-32 md:size-40 relative overflow-hidden">
            <Image
              src={maintainer.image}
              alt={maintainer.name}
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </Link>
      
      {/* Name and Year */}
      <motion.p 
        className="text-body font-bold text-center mt-4"
        whileHover={{
          textShadow: "0px 0px 12.1px #6EB8FF",
          scale: 1.05,
        }}
      >
        {maintainer.name}
      </motion.p>
      <p className="text-small text-[#484848] text-center">
        {maintainer.year}
      </p>
    </motion.div>
  );
};

export default Content;

