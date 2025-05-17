"use client";

import { Raleway } from "next/font/google";
import logo from "../../../../public/logo.webp";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const raleway = Raleway({
  subsets: ["latin"],
  weight: "variable",
});

const Content = () => {
  return (
    <div className="absolute left-6 sm:left-8 bottom-8 sm:bottom-10 w-fit h-fit flex flex-col z-10">
      {/* LOGO */}
      <div className="size-[12vw] mb-4">
        <Image src={logo} alt="logo" />
      </div>

      {/* CONTACT */}
      <div>
        <h2 className="text-body text-white font-bold mb-2 sm:mb-4">
          CONTACT US
        </h2>

        <Link
          href={"tel:+919897777123"}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-white text-body-small"
        >
          <motion.p
            whileHover={{
              textShadow: "0px 0px 12.1px #6EB8FF",
              fontWeight: 600,
            }}
          >
            SHASHWAT SHINGHAL – +91 98977 77123
          </motion.p>
        </Link>
        <Link
          href={"tel:+919410496070"}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-white text-body-small"
        >
          <motion.p
            whileHover={{
              textShadow: "0px 0px 12.1px #6EB8FF",
              fontWeight: 600,
            }}
          >
            DHAIRYA SARASWAT – +91 94104 96070
          </motion.p>
        </Link>
        
        {/* WEBSITE CARETAKER */}
        <div className="mt-4 sm:mt-6">
          <p className="text-white text-body-small opacity-80 font-medium mb-1">
            Site maintained by:
          </p>
          <ul className="list-none pl-0">
            <li>
              <motion.p 
                className="text-white text-body-small opacity-80 font-medium"
                whileHover={{
                  textShadow: "0px 0px 12.1px #6EB8FF",
                  opacity: 1,
                  fontWeight: 600,
                }}
              >
                Shashwat Shinghal
              </motion.p>
            </li>
            <li>
              <motion.p 
                className="text-white text-body-small opacity-80 font-medium"
                whileHover={{
                  textShadow: "0px 0px 12.1px #6EB8FF",
                  opacity: 1,
                  fontWeight: 600,
                }}
              >
                Abhishek Bansal
              </motion.p>
            </li>
            <li>
              <motion.p 
                className="text-white text-body-small opacity-80 font-medium"
                whileHover={{
                  textShadow: "0px 0px 12.1px #6EB8FF",
                  opacity: 1,
                  fontWeight: 600,
                }}
              >
                Baljeet Singh
              </motion.p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Content;