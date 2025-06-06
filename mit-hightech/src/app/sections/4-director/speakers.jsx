"use client";

import Content from "./content";
import Graphics from "./graphics";

const Director = () => {
  return (
    <section id="coordinator" className="relative h-fit py-[10vw] overflow-hidden">
      <Graphics />
      <Content />
    </section>
  );
};

export default Director;
