import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    number: "1",
    title: "Services &\nCapabilities",
    glowColor: "from-blue-500/20",
    items: [
      "Content Planning & Strategy",
      "Retention-focused Editing",
      "Visual Rhythm & Pacing",
      "Creative Direction",
    ],
  },
  {
    number: "2",
    title: "Scale &\nImpact",
    glowColor: "from-purple-500/20",
    items: [
      "K9 Vines (1M+ audience)",
      "Imran Teli (250K+ learners)",
      "Content used in 40+ countries",
      "High-converting ROI",
    ],
  },
  {
    number: "3",
    title: "Ideal\nPartners",
    glowColor: "from-emerald-500/20",
    items: [
      "Creators scaling their content",
      "Educators building authority",
      "Startups building presence",
      "Agencies needing a partner",
    ],
  },
];

export default function WhatIDo() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const cards = root?.querySelectorAll(".premium-card");
      if (!root || !cards?.length) return;
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-20 lg:py-32 px-4 lg:px-8 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6 mb-16 lg:mb-24">
          <div className="w-12 h-[1px] bg-white/20"></div>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#a3a3a3]">Value & Reach</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {CARDS.map((card, index) => (
            <div 
              key={card.number} 
              className="premium-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212] p-8 md:p-10 lg:p-12 flex flex-col h-full group transition-transform duration-500 will-change-transform hover:-translate-y-2"
            >
              {/* The Background Glow */}
              <div className={`absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-tl ${card.glowColor} to-transparent blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-700`}></div>
              
              {/* The Dot Grid Pattern */}
              <div 
                className="absolute inset-0 z-0 opacity-[0.15]" 
                style={{ 
                  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)", 
                  backgroundSize: "20px 20px" 
                }}
              ></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start gap-4 mb-16">
                  <span className="text-7xl md:text-[6rem] font-black text-white/[0.04] leading-[0.8] -ml-2 select-none tracking-tighter">
                    {card.number}
                  </span>
                  <h3 className="text-2xl md:text-[28px] font-bold text-[#fafafa] leading-[1.1] whitespace-pre-line tracking-tight mt-2">
                    {card.title}
                  </h3>
                </div>

                <ul className="flex flex-col gap-6 mt-auto">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 text-[#d4d4d4] font-medium text-base md:text-lg tracking-[-0.01em]">
                      <span className="text-white/30 font-mono mt-0.5 select-none">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
