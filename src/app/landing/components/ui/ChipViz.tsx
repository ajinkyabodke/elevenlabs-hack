"use client";

import { motion } from "motion/react";

const ChipViz = () => {
  const createVariants = ({
    scale,
    delay,
  }: {
    scale: number;
    delay: number;
  }) => ({
    initial: { scale: 1 },
    animate: {
      scale: [1, scale, 1],
      transition: {
        duration: 2,
        times: [0, 0.2, 1],
        ease: [0.23, 1, 0.32, 1],
        repeat: Infinity,
        repeatDelay: 2,
        delay,
      },
    },
  });

  return (
    <div className="relative flex items-center">
      <div className="relative">
        <motion.div
          variants={createVariants({ scale: 1.1, delay: 0 })}
          initial="initial"
          animate="animate"
          className="bg-linear-to-r absolute -inset-px z-0 rounded-full from-cyan-500 via-cyan-700 to-cyan-900 opacity-30 blur-xl"
        />
        <motion.div
          variants={createVariants({ scale: 1.08, delay: 0.1 })}
          initial="initial"
          animate="animate"
          className="bg-linear-to-b relative z-0 min-h-[80px] min-w-[80px] rounded-full border from-white to-cyan-50 shadow-xl shadow-cyan-500/20"
        >
          <motion.div
            variants={createVariants({ scale: 1.06, delay: 0.2 })}
            initial="initial"
            animate="animate"
            className="absolute inset-1 rounded-full from-cyan-500 via-cyan-700 to-cyan-900 p-0.5 shadow-xl"
          >
            <div className="shadow-xs relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-indigo-300 will-change-transform">
              <div className="size-full bg-indigo-300" />
              <motion.div
                variants={createVariants({ scale: 1.04, delay: 0.3 })}
                initial="initial"
                animate="animate"
                className="bg-linear-to-t absolute inset-0 rounded-full from-cyan-500 via-cyan-700 to-cyan-900 opacity-50 shadow-[inset_0_0_16px_4px_rgba(0,0,0,1)]"
              />
              <motion.div
                variants={createVariants({ scale: 1.02, delay: 0.4 })}
                initial="initial"
                animate="animate"
                className="absolute inset-[6px] rounded-full bg-indigo-100 p-1 backdrop-blur-[1px]"
              >
                <div className="bg-linear-to-br relative flex h-full w-full items-center justify-center rounded-full from-white to-gray-300 shadow-lg shadow-black/40">
                  <img src="/EchoLogo.png" alt="Echo Logo" className="w-10" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ChipViz;
