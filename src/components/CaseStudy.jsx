import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CASE_STUDIES = [
  {
    client: "K9 & Charu",
    iconType: "image",
    icon: "/k9-charu.jpg",
    goal: "Produce high-performing videos for their YouTube channel",
    approach: [
      "Produced 2 highly engaging YouTube videos",
      "Optimized pacing for maximum retention",
      "Dynamic visual storytelling",
    ],
    result: [
      "500K+ total views across both videos",
      "Significant engagement spike",
      "Leveraged their 1M+ audience",
    ],
  },
  {
    client: "Imran Teli",
    iconType: "image",
    icon: "/imran.png",
    goal: "Create high-converting course intro videos",
    approach: [
      "Structured storytelling",
      "Retention-focused editing",
      "Clean visual positioning",
    ],
    result: [
      "Used by 250K+ learners",
      "4.6 rated content",
      "Reaching 40+ countries",
    ],
  },
];

export default function CaseStudy() {
  const rootRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const header = root?.querySelector(".study-header");
      const slider = root?.querySelector(".study-slider");
      
      if (!root) return;
      
      gsap.fromTo(
        header,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        slider,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.2,
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

  const scrollPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -window.innerWidth * 0.8, behavior: "smooth" });
    }
  };

  const scrollNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: "smooth" });
    }
  };

  return (
    <section ref={rootRef} className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 px-4 lg:px-8 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto relative">
        
        {/* Header & Controls */}
        <div className="study-header flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 lg:mb-24">
          <div>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-[1px] bg-white/20"></div>
              <h2 className="text-sm font-mono tracking-widest uppercase text-[#a3a3a3]">
                Case Studies
              </h2>
            </div>
            <h3 className="text-[clamp(3rem,5vw,4.5rem)] font-satoshi font-light leading-tight tracking-[-0.04em]">
              Proven Results
            </h3>
          </div>
          
          {/* Slider Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
              aria-label="Previous case study"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button 
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
              aria-label="Next case study"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          ref={sliderRef}
          className="study-slider flex w-full overflow-x-auto snap-x snap-mandatory gap-8 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {CASE_STUDIES.map((study, idx) => (
            <div key={idx} className="w-full min-w-full lg:min-w-[calc(100%-4rem)] shrink-0 snap-center">
              <div className="bg-[#121212] border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative overflow-hidden group">
                
                {/* Subtle Background Glow */}
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                {/* Left Column: Title & Goal */}
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div>
                    {study.iconType === "image" ? (
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-8 shadow-inner shrink-0">
                        <img src={study.icon} alt={study.client} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mb-8 shadow-inner shrink-0">
                        {study.icon}
                      </div>
                    )}
                    <h4 className="text-[clamp(2.5rem,4vw,3.5rem)] font-satoshi font-light leading-tight tracking-[-0.02em] mb-12">
                      {study.client}
                    </h4>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-white/40 to-transparent"></div>
                    <h5 className="text-xs font-mono tracking-widest uppercase text-[#a3a3a3] mb-4">
                      Goal
                    </h5>
                    <p className="font-satoshi text-xl font-light text-[#fafafa] leading-relaxed">
                      {study.goal}
                    </p>
                  </div>
                </div>

                {/* Right Column: Approach & Result */}
                <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center gap-12 lg:gap-16">
                  
                  <div>
                    <h5 className="text-xs font-mono tracking-widest uppercase text-[#a3a3a3] mb-6 pb-4 border-b border-white/10">
                      Approach
                    </h5>
                    <ul className="flex flex-col gap-5 font-satoshi text-lg md:text-xl font-light text-[#fafafa]">
                      {study.approach.map((t, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="text-white/30 mt-1.5 text-sm select-none">✦</span>
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono tracking-widest uppercase text-[#a3a3a3] mb-6 pb-4 border-b border-white/10">
                      Result
                    </h5>
                    <ul className="flex flex-col gap-5 font-satoshi text-lg md:text-xl font-light text-[#fafafa]">
                      {study.result.map((t, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="text-green-400/50 mt-1.5 text-sm select-none">✦</span>
                          <span className="leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
