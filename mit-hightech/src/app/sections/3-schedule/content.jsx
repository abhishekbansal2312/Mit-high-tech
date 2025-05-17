"use client";

import Parallax from "@/app/components/parallax";
import { motion, useInView } from "framer-motion";
import { Raleway } from "next/font/google";
import { useRef } from "react";

import noise from "../../../../public/noise.webp";

const raleway = Raleway({
  subsets: ["latin"],
  weight: "variable",
});

// Event schedule data for the single day
const scheduleData = [
  { "start": "10:00 AM", "name": "Inauguration Ceremony" },
  { "start": "10:30 AM", "name": "Introduction to Events" },
  { "start": "11:00 AM", "name": "Schedule will be shared soon" },
  // { "start": "12:30 PM", "name": "Lunch Break" },
  // { "start": "01:30 PM", "name": "IDEATHON Presentations" },
  // { "start": "02:30 PM", "name": "PROJECTATHON Showcase" },
  // { "start": "03:30 PM", "name": "Tea Break" },
  // { "start": "04:00 PM", "name": "DEBATE & GD Sessions" },
  // { "start": "05:00 PM", "name": "TECHNICAL PRESENTATION" },
  // { "start": "06:30 PM", "name": "Prize Distribution & Closing Ceremony" }
];

const Content = () => {
  const container = useRef(null);
  const isInView = useInView(container, { once: true });

  return (
    <motion.div
      ref={container}
      className="absolute top-[8vw] sm:top-[12vw] right-[12.5vw] w-[75vw] z-40"
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
          SCHEDULE
        </motion.h2>

        {/* BODY */}
        <motion.div
          animate={{
            opacity: isInView ? 1 : 0,
            backgroundImage: `url(${noise.src})`,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`${raleway.className} p-5 md:p-10 bg-[#ffffffaa] backdrop-blur-[33px] drop-shadow-lg rounded-[16px] md:rounded-[30px] flex flex-col justify-between gap-2 md:gap-5 min-h-[400px]`}
        >
          {/* DAY */}
          <p className="font-bold text-body">
            MAY 23, 2025 | D-Block Auditorium
          </p>

          {/* SCHEDULE */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-1 sm:gap-3 md:gap-5"
          >
            {scheduleData.map((event, i) => (
              <ScheduleUnit event={event} key={i} />
            ))}
          </motion.div>

          {/* INFO NOTE */}
          <div className="mt-2 text-center">
            <p className="text-small italic text-[#484848]">
              All participants must arrive at least 30 minutes before the event starts
            </p>
          </div>
        </motion.div>
      </Parallax>
    </motion.div>
  );
};

const ScheduleUnit = ({ event }) => {
  return (
    <div className="border-l-2 md:border-l-4 border-white pl-2 md:pl-3 flex items-center">
      <p className="text-small font-medium text-[#484848] w-[80px] text-nowrap h-fit">
        {event.start}
      </p>
      <p className="flex-1 text-body font-medium text-black h-fit">
        {event.name}
      </p>
    </div>
  );
};

export default Content;