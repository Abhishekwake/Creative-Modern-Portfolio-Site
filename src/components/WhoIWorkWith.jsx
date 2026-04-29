import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  "Creators scaling their content",
  "Educators building authority",
  "Startups building online presence",
];

export default function WhoIWorkWith() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const lines = root?.querySelectorAll(".who-line");
      if (!root || !lines?.length) return;
      gsap.fromTo(
        lines,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 px-4 lg:px-8 border-t border-white/5 flex items-center justify-center">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center text-center">
        <div className="flex items-center gap-6 mb-16 who-line">
          <div className="w-12 h-[1px] bg-white/20 hidden md:block"></div>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#a3a3a3]">
            Who I Work With
          </h2>
          <div className="w-12 h-[1px] bg-white/20 hidden md:block"></div>
        </div>
        
        <ul className="flex flex-col gap-6 md:gap-8">
          {ITEMS.map((t) => (
            <li
              key={t}
              className="who-line font-satoshi text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-[-0.02em] text-[#fafafa] flex flex-col md:flex-row items-center gap-4 group cursor-default"
            >
              <span aria-hidden className="text-white/20 group-hover:text-white transition-colors duration-500 hidden md:inline-block">
                ✦
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
