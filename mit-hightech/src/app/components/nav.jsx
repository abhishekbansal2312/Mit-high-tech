"use client";

import Link from "next/link";
import {
  animate,
  AnimatePresence,
  motion,
  stagger,
  useInView,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect, useRef, useState } from "react";
import logo from "../../../public/image.png";
import Image from "next/image";
import { IconX, IconMenuDeep, IconLogin, IconUserPlus, IconLogout } from "@tabler/icons-react";
import { SignInButton, SignUpButton, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollToPlugin);

const Nav = () => {
  const sections = [
    "about",
    "events",
    "schedule",
    "flappybird",
    "leaderboard"
  ];
  const [currSection, setCurrSection] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  // Update the indicator style as currSection changes
  useEffect(() => {
    if (currSection) {
      const rect = currSection.current.getBoundingClientRect();
      setIndicatorStyle((prev) => ({
        ...prev,
        opacity: 1,
        left: rect.left,
        width: rect.width,
      }));
    }
  }, [currSection]);

  return (
    <header>
      {/* DESKTOP */}
      <motion.nav
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: "backInOut" }}
        className="hidden md:flex fixed w-screen justify-between gap-10 py-6 top-0 px-6 sm:px-10 z-50 bg-gradient-to-b from-[#211254dd] to-[#21125400]"
      >
        {/* LOGO */}
        <div className="hidden md:block size-16">
          <Image src={logo} alt="logo" />
        </div>

        {/* INDICATOR BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={indicatorStyle}
          transition={{ opacity: { delay: 1 }, type: "spring", stiffness: 50 }}
          className="hidden md:block bg-white h-[2px] sm:h-[3px] w-10 fixed top-[45px] md:top-[70px]"
        />

        <ul className="flex w-full max-w-[900px] items-center justify-between">
          {sections.map((name, i) => (
            <NavItem name={name} setCurrSection={setCurrSection} key={i} />
          ))}
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <ClerkAuthButton type="signin" />
                <ClerkAuthButton type="signup" />
              </>
            ) : (
              <>
                <ApplyButton />
                <LogoutButton />
              </>
            )}
          </div>
        </ul>
      </motion.nav>

      {/* MOBILE */}
      <motion.nav
        animate={{ height: isClicked ? "auto" : 0 }}
        className="flex flex-col items-end gap-8 md:hidden fixed w-screen py-6 px-6 z-50 bg-gradient-to-b from-[#211254dd] to-[#21125400]"
      >
        {/* LOGO */}
        <div className="absolute top-6 left-6 size-10">
          <Image src={logo} alt="logo" />
        </div>

        <AnimatePresence mode="wait">
          {/* MENU ICON */}
          {isClicked ? (
            <motion.div
              key={isClicked}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <IconX
                onClick={() => setIsClicked(false)}
                color="white"
                size={32}
                className="cursor-pointer"
              />
            </motion.div>
          ) : (
            <motion.div
              key={isClicked}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <IconMenuDeep
                onClick={() => setIsClicked(true)}
                color="white"
                size={32}
                className="cursor-pointer"
              />
            </motion.div>
          )}

          {isClicked && (
            <ul className="flex flex-col gap-6 items-end pb-20">
              {sections.map((name, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <NavItem name={name} setCurrSection={setCurrSection} />
                </motion.div>
              ))}
              <div className="flex flex-col gap-4 items-end">
                {!isSignedIn ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: sections.length * 0.05,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <ClerkAuthButton type="signin" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: sections.length * 0.05 + 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <ClerkAuthButton type="signup" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: sections.length * 0.05,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <ApplyButton />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: sections.length * 0.05 + 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    >
                      <LogoutButton />
                    </motion.div>
                  </>
                )}
              </div>
            </ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

const NavItem = ({ name, setCurrSection }) => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  
  // Special handling for Flappy Bird and Leaderboard sections
  const handleClick = () => {
    if (name === "flappybird") {
      if (isSignedIn) {
        router.push("/flappybird");
      } else {
        router.push("/sign-in");
      }
    } else if (name === "leaderboard") {
      if (isSignedIn) {
        router.push("/flappybird/leaderboard");
      } else {
        router.push("/sign-in");
      }
    } else {
      // Regular section navigation
      gsap.to(window, {
        duration: 1,
        scrollTo: `#${name}`,
        ease: "power2.inOut",
      });
    }
  };

  const ref = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: "some" });

  useEffect(() => {
    if (name !== "flappybird" && name !== "leaderboard") {
      sectionRef.current = document.getElementById(name);
    }
  }, [name]);

  useEffect(() => {
    if (isInView) {
      setCurrSection(ref);
    }
  }, [isInView, ref, setCurrSection]);

  // Format display names
  let displayName;
  if (name === "flappybird") {
    displayName = "FLAPPY BIRD";
  } else if (name === "leaderboard") {
    displayName = "LEADERBOARD";
  } else {
    displayName = name.toUpperCase();
  }

  return (
    <motion.li
      ref={ref}
      animate={{ color: isInView ? "#ffffff" : "#c1c1c1" }}
      whileHover={{
        textShadow: "0px 0px 12.1px #6EB8FF",
        color: "#ffffff",
      }}
      onClick={() => handleClick()}
      className="text-[12px] sm:text-[20px] max-md:!text-white font-bold md:font-semibold drop-shadow-md cursor-pointer leading-tight"
    >
      {displayName}
    </motion.li>
  );
};

const ClerkAuthButton = ({ type }) => {
  const [isHovered, setIsHovered] = useState(false);
  const text = type === "signin" ? "SIGN IN" : "SIGN UP";
  const hoverText = type === "signin" ? "LOGIN" : "JOIN";
  const icon = type === "signin" ? <IconLogin size={16} /> : <IconUserPlus size={16} />;
  const href = type === "signin" ? "/sign-in" : "/sign-up";

  useEffect(() => {
    const selector = `.stagger-letter-${type}-1`;
    const selectorHover = `.stagger-letter-${type}-2`;
    
    animate(
      selector,
      { y: isHovered ? -28 : 0, opacity: isHovered ? 0 : 1 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
    animate(
      selectorHover,
      { y: isHovered ? -28 : 0, opacity: isHovered ? 1 : 0 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
  }, [isHovered, type]);

  return (
    <Link href={href}>
      <motion.div
        animate={{ 
          background: isHovered ? "#ffffffff" : "#ffffffcc",
          borderColor: isHovered ? "#6EB8FF" : "transparent"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative font-bold text-brand-primary z-10 px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md rounded-md sm:rounded-lg border-2 flex items-center gap-2 cursor-pointer"
      >
        {icon}
        <div className="overflow-hidden leading-none text-[14px] sm:text-[18px] h-[14px] sm:h-[18px]">
          <div className="mb-2">
            {text.split("").map((char, i) => (
              <div className={`stagger-letter-${type}-1 inline-block`} key={i}>
                {char}
              </div>
            ))}
          </div>
          <div>
            {hoverText.split("").map((char, i) => (
              <div className={`stagger-letter-${type}-2 inline-block`} key={i}>
                {char}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const LogoutButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { signOut } = useClerk();

  useEffect(() => {
    animate(
      ".stagger-letter-logout-1",
      { y: isHovered ? -28 : 0, opacity: isHovered ? 0 : 1 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
    animate(
      ".stagger-letter-logout-2",
      { y: isHovered ? -28 : 0, opacity: isHovered ? 1 : 0 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
  }, [isHovered]);

  const handleLogout = () => {
    signOut();
  };

  return (
    <motion.div
      animate={{ 
        background: isHovered ? "#ffffffff" : "#ffffffcc",
        borderColor: isHovered ? "#6EB8FF" : "transparent"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleLogout}
      className="relative font-bold text-brand-primary z-10 px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md rounded-md sm:rounded-lg border-2 flex items-center gap-2 cursor-pointer"
    >
      <IconLogout size={16} />
      <div className="overflow-hidden leading-none text-[14px] sm:text-[18px] h-[14px] sm:h-[18px]">
        <div className="mb-2">
          {"LOGOUT".split("").map((char, i) => (
            <div className="stagger-letter-logout-1 inline-block" key={i}>
              {char}
            </div>
          ))}
        </div>
        <div>
          {"EXIT".split("").map((char, i) => (
            <div className="stagger-letter-logout-2 inline-block" key={i}>
              {char}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ApplyButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    animate(
      ".stagger-letter-apply-1",
      { y: isHovered ? -28 : 0, opacity: isHovered ? 0 : 1 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
    animate(
      ".stagger-letter-apply-2",
      { y: isHovered ? -28 : 0, opacity: isHovered ? 1 : 0 },
      { delay: stagger(0.03, { ease: "easeOut" }), ease: "circOut" }
    );
  }, [isHovered]);

  return (
    <Link
      href="https://docs.google.com/forms/d/e/1FAIpQLSfv1eaLcvfTN9NApP7IRDsdtrzjiD4ZVrhLU5xL7XT0lRbC5g/viewform?usp=sharing&ouid=106007621048068235427"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ 
          background: isHovered ? "#ffffffff" : "#ffffffcc",
          boxShadow: isHovered ? "0px 0px 12px 0px #6EB8FF" : "none" 
        }}
        className="relative font-bold text-brand-primary z-10 px-2 py-1 sm:px-4 sm:py-2 backdrop-blur-md rounded-md sm:rounded-lg"
      >
        <div className="overflow-hidden leading-none text-[14px] sm:text-[20px] h-[14px] sm:h-[20px]">
          <div className="mb-2">
            {"Register".split("").map((char, i) => (
              <div className="stagger-letter-apply-1 inline-block" key={i}>
                {char}
              </div>
            ))}
          </div>
          <div>
            {"APPLY".split("").map((char, i) => (
              <div className="stagger-letter-apply-2 inline-block" key={i}>
                {char}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default Nav;