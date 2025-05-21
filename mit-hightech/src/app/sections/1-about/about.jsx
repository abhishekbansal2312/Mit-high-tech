"use client";

import Content from "./content";
import Graphics from "./graphics";

const About = () => {
  return (
    <div id="about" className="relative h-[100vw] overflow-hidden">
      <Graphics />
      <Content />
    </div>
  );
};

export default About;
