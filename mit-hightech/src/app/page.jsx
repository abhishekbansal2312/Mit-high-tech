"use client";

import About from "./sections/1-about/about";
import FAQ from "./sections/5-faq/faq";
import Schedule from "./sections/3-schedule/schedule";
import Tracks from "./sections/2-tracks/tracks";
import Nav from "./components/nav";
import Landing from "./sections/0-landing/landing";
import Speakers from "./sections/4-speakers/speakers";
import Footer from "./sections/7-footer/footer";
import { Raleway } from "next/font/google";
import Timer from "./components/timer";
import { useEffect } from "react";
import Conveners from "./sections/4-conveners/speakers";
import Director from "./sections/4-director/speakers";
import Maintainers from "./sections/6-mainteners/mainteners";

import FlappyBird from "./sections/6-game/schedule";


export default function Home() {
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      const scroll = new LocomotiveScroll({});
    })();
  });

  return (
    <>
      <Nav />
      <main>
        <section id="about">
          <Landing />
          <About />
        </section>
        <Tracks />
        <Schedule />
        <Director/>
        <Conveners/>
        <Speakers />
        <FAQ />
        <Maintainers/>
      <FlappyBird/>
        <Footer />
      </main>
      <Timer />
    </>
  );
}
