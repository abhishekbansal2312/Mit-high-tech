"use client";

import Content from "./content";
import Graphics, { TransitionGraphics } from "./graphics";
import { useState, useEffect } from "react";

const FlappyBird = () => {
  const [height, setHeight] = useState("70vh");

  // Dynamically adjust the height based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 480) { // Extra small devices
        setHeight("100vh");
      } else if (width < 768) { // Small devices
        setHeight("80vh");
      } else if (width < 1024) { // Medium devices
        setHeight("70vh");
      } else if (width < 1280) { // Large devices
        setHeight("60vh");
      } else { // Extra large devices
        setHeight("55vh");
      }
    };

    // Set initial height
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="schedule" className="relative h-fit mb-50 py-[10vw] overflow-hidden">
      {/* Dynamic height container with transition */}
      <div 
        className="relative w-full overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height }}
      >
        {/* Background graphics layer
        <div className="absolute inset-0 z-0">
          <TransitionGraphics />
        </div>
         */}
        {/* Content layer with responsive top margin */}
      
          <div className="">
            <Content />
     
        </div>
      </div>
    </section>
  );
};

export default FlappyBird;