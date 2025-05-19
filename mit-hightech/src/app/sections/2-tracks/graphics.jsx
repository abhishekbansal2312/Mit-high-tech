"use client";

import Parallax from "../../components/parallax";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

import {
  asteroid_1,
  asteroid_1_cropped,
  asteroid_2,
  asteroid_2_cropped,
  asteroid_3,
  asteroid_3_cropped,
  asteroid_4,
  asteroid_4_cropped,
  asteroid_small_1,
  asteroid_small_2,
  asteroid_small_3,
  asteroid_small_4,
  bg,
  planet,
} from "./graphicsData";

const Graphics = () => {
  const container = useRef(null);

  // Parallax speeds
  const distant = [
    asteroid_small_1,
    asteroid_small_2,
    asteroid_small_3,
    asteroid_small_4,
  ];
  const medium = [planet];

  const [track, setTrack] = useState(-1);

  return (
    <div ref={container} className="absolute top-0 left-0 w-full h-full">
      {/* BG */}
      <Image
        id="tracks-bg"
        src={bg}
        alt="bg"
        loading="eager"
        className="absolute z-0 w-screen"
      />

      {/* GRAPHICS */}
      {distant.map((item, index) => (
        <Parallax containerRef={container} speed={"sm"} key={index}>
          <Image src={item} alt={"img"} className="w-screen" />
        </Parallax>
      ))}

      {medium.map((item, index) => (
        <Parallax containerRef={container} speed={"md"} key={index}>
          <Image src={item} alt={"img"} className="w-screen" />
        </Parallax>
      ))}

      <Parallax containerRef={container} speed={"lg"} fillContainer={false}>
        <motion.div
          whileHover={{ scale: 1.05, origin: 0.5 }}
          onMouseEnter={() => setTrack(0)}
          onMouseLeave={() => setTrack(-1)}
          className="w-[27vw] absolute left-[53vw] top-[5vw] origin-center cursor-pointer place-items-center"
        >
          <Image src={asteroid_1_cropped} alt="asteroid" />
          <div className="absolute left-0 top-0 size-full flex items-center justify-center">
            <p className="h-fit w-2/3 text-body text-center font-bold text-white">
            CODEATHON
            </p>
          </div>
          <AnimatePresence>
            {track === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute h-full w-[53vw] top-0 -left-[53vw] pl-[7vw] pr-[5vw] flex flex-col justify-center bg-gradient-to-r from-bg to-transparent"
              >
                <p className="text-body-small text-white font-bold">
                  A Dual-round, time-bound algorithmic coding challenge to sharpen your problem-solving skills and connect with fellow coders. Open to all MIT students.
                </p>
                <ul className="hidden md:block mt-2 text-body-small text-white list-disc list-inside">
                  <li>60-minute online contest via proctored Google Meet</li>
                  <li>Individual participation (no teams)</li>
                  <li>Evaluated on correctness, efficiency, and submission time</li>
                  <li>Certificates and prizes for top performers</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Parallax>

      <Parallax containerRef={container} speed={"lg"} fillContainer={false}>
        <motion.div
          whileHover={{ scale: 1.05, origin: 0.5 }}
          onMouseEnter={() => setTrack(1)}
          onMouseLeave={() => setTrack(-1)}
          className="w-[31vw] absolute left-[15vw] top-[37vw] origin-center cursor-pointer place-items-center"
        >
          <Image src={asteroid_2_cropped} alt="asteroid" />
          <div className="absolute left-0 top-0 size-full flex items-center justify-center">
            <p className="h-fit w-2/3 text-body text-center font-bold text-white">
              IDEATHON
            </p>
          </div>
          <AnimatePresence>
            {track === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute h-full w-[54vw] top-0 left-[31vw] pl-[5vw] pr-[7vw] flex flex-col justify-center bg-gradient-to-l from-bg to-transparent"
              >
                <p className="text-body-small text-white font-bold">
                  Transform creative concepts into viable startup ideas addressing real-world problems in any domain. Expert mentors will guide winners toward turning ideas into tangible solutions.
                </p>
                <ul className="hidden md:inline mt-2 text-body-small text-white list-disc list-inside">
                  <li>Teams of 2-4 members (no working model needed)</li>
                  <li>Two rounds: PPT submission and presentation</li>
                  <li>5-8 minute pitch with Q&A for finalists</li>
                  <li>Judged on novelty, feasibility, and market potential</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Parallax>

      <Parallax containerRef={container} speed={"lg"} fillContainer={false}>
        <motion.div
          whileHover={{ scale: 1.05, origin: 0.5 }}
          onMouseEnter={() => setTrack(2)}
          onMouseLeave={() => setTrack(-1)}
          className="w-[30vw] absolute left-[18vw] top-[58vw] origin-center cursor-pointer place-items-center"
        >
          <Image src={asteroid_3_cropped} alt="asteroid" />
          <div className="absolute left-0 top-0 size-full flex items-center justify-center">
            <p className="h-fit relative top-[3vw] -left-[2vw] w-1/2 text-body text-center font-bold text-white">
              PROJECTATHON
            </p>
          </div>
          <AnimatePresence>
            {track === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute h-full w-[52vw] top-0 left-[31vw] pl-[5vw] pr-[7vw] flex flex-col justify-center bg-gradient-to-l from-bg to-transparent"
              >
                <p className="text-body-small text-white font-bold">
                  A hands-on competition where teams present fully functional, working prototypes. You must demo a running solution—this tests your ability to execute ideas into real implementations.
                </p>
                <ul className="hidden md:block mt-2 text-body-small text-white list-disc list-inside">
                  <li>Teams of 1-4 members with working demos</li>
                  <li>5-minute presentation with Q&A session</li>
                  <li>Judged on functionality, innovation, and implementation</li>
                  <li>All team members must be present for evaluation</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Parallax>

      <Parallax containerRef={container} speed={"lg"} fillContainer={false}>
        <motion.div
          whileHover={{ scale: 1.05, origin: 0.5 }}
          onMouseEnter={() => setTrack(3)}
          onMouseLeave={() => setTrack(-1)}
          className="w-[35vw] absolute left-[60vw] top-[83vw] origin-center cursor-pointer place-items-center"
        >
          <Image src={asteroid_4_cropped} alt="asteroid" />
          <div className="absolute left-0 top-0 size-full flex items-center justify-center">
            <p className="h-fit relative top-[3vw] w-1/2 text-body text-center font-bold text-white">
              DEBATE & GD
            </p>
          </div>
          <AnimatePresence>
            {track === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute h-full w-[60vw] top-0 -left-[60vw] pl-[7vw] pr-[5vw] flex flex-col justify-center bg-gradient-to-r from-bg to-transparent"
              >
                <p className="text-body-small text-white font-bold">
                  A two-phase speaking challenge designed to sharpen your group‐discussion and formal debating skills. Individual participation focusing on tech-related topics.
                </p>
                <ul className="mt-2 text-body-small text-white list-disc list-inside">
                  <li>Round 1: Group Discussion on technical topics</li>
                  <li>Round 2: Structured formal debate (for qualifiers)</li>
                  <li>Judged on content, clarity, confidence, and team dynamics</li>
                  <li>Great for resume building and interview preparation</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Parallax>

      {/* Added 5th asteroid using asteroid_1 assets */}
      <Parallax containerRef={container} speed={"lg"} fillContainer={false}>
        <motion.div
          whileHover={{ scale: 1.05, origin: 0.5 }}
          onMouseEnter={() => setTrack(4)}
          onMouseLeave={() => setTrack(-1)}
          className="w-[27vw] absolute left-[42vw] top-[110vw] origin-center cursor-pointer place-items-center"
        >
          <Image src={asteroid_1_cropped} alt="asteroid" />
          <div className="absolute left-0 top-0 size-full flex items-center justify-center">
            <p className="h-fit w-2/3 text-body text-center font-bold text-white">
              TECHXTHON
            </p>
          </div>
          <AnimatePresence>
            {track === 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute h-full w-[42vw] top-0 -left-[42vw] pl-[7vw] pr-[5vw] flex flex-col justify-center bg-gradient-to-r from-bg to-transparent"
              >
                <p className="text-body-small text-white font-bold">
                  A solo event where you deliver a concise, well-structured talk on a technical topic of your choice, demonstrating your ability to research and communicate complex ideas.
                </p>
                <ul className="hidden md:block mt-2 text-body-small text-white list-disc list-inside">
                  <li>5-7 minute presentation with 2-3 minute Q&A</li>
                  <li>Judged on content, structure, visual design, and delivery</li>
                  <li>Individual participation with visual aids required</li>
                  <li>Enhances your resume and communication portfolio</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Parallax>
    </div>
  );
};

export default Graphics;