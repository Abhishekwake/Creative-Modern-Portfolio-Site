import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LINES = [
  "Worked with:",
  "K9 Vines (1M+ audience)",
  "Imran Teli (250K+ learners)",
  "Content used across 40+ countries",
];

export default function Credibility() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const lines = root?.querySelectorAll(".cred-line");
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
    <section
      ref={rootRef}
      className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 md:py-40 border-t border-white/5"
    >
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
        <div className="w-full text-center flex flex-col items-center justify-center gap-4">
          {LINES.map((line, i) => (
            <p
              key={`${line}-${i}`}
              className={`cred-line font-satoshi ${
                i === 0 
                  ? "uppercase tracking-widest text-[#a3a3a3] text-sm font-mono mb-8" 
                  : "text-[clamp(1.5rem,3vw,2.5rem)] font-light leading-snug tracking-[-0.02em] text-[#fafafa]"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
