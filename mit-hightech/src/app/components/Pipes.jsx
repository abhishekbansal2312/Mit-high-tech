import { motion } from "framer-motion";
import useGame from "../hooks/useGame";
import useInterval from "../hooks/useInterval";
import React from "react";
import Image from "next/image";

export default function Pipes() {
  const {
    isStarted,
    pipe: { delay },
    pipes: pipesArray,
    movePipes,
  } = useGame();
  useInterval(() => movePipes(), isStarted ? delay : null);
  return (
    <>
      {pipesArray.map((pipes, index) => (
        <React.Fragment key={`pipe-group-${index}`}>
          <motion.div
            key={pipes.top.key}
            initial={pipes.top.initial}
            animate={pipes.top.position}
            style={{
              ...pipes.top.size,
              rotate: 180,
            }}
            className="absolute z-40"
            transition={{
              ease: "linear",
            }}
          >
            <Pipe />
          </motion.div>
          <motion.div
            key={pipes.bottom.key}
            initial={pipes.bottom.initial}
            animate={pipes.bottom.position}
            style={pipes.bottom.size}
            className="absolute z-40"
            transition={{
              ease: "linear",
            }}
          >
            <Pipe />
          </motion.div>
        </React.Fragment>
      ))}
    </>
  );
}

export function Pipe() {
  return (
        <Image
      src="/pipe.png"
      alt="pipe"
      width={50}
      height={300}
      className="h-full w-full pointer-events-none"
    />
  );
}