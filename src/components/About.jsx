import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import rightPlaceholder from "../assets/rightplaceholder.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const wrapperRef = useRef(null);

  const paragraph = "A growth-focused video editor and content strategist helping creators, businesses, and influencers turn ideas into content that performs. I specialize in retention-driven editing and performance-focused visuals, working with creators like K9 Vines (1M+ audience) and contributing to content for Imran Teli, a bestselling Udemy instructor, reaching 250K+ learners across 40+ countries.";

  const words = paragraph.split(" ");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image scroll parallax & scale effect
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15, filter: "brightness(0.5) grayscale(100%)" },
        {
          scale: 1,
          filter: "brightness(0.9) grayscale(0%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 85%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // Premium word-by-word opacity reveal
      const wordElements = textRef.current.querySelectorAll(".word");
      gsap.fromTo(
        wordElements,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.2, // increased stagger for scrub spread
          ease: "none",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 75%",
            end: "center 25%",
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative z-20 flex min-h-screen w-full items-center overflow-hidden bg-[#0a0a0a] text-[#fafafa] py-20 lg:py-32 border-t border-white/5">
      <div ref={wrapperRef} className="max-w-[1400px] mx-auto grid w-full grid-cols-12 items-center gap-8 lg:gap-24 px-4 lg:px-8">

        <div className="order-2 col-span-12 flex flex-col justify-center font-satoshi lg:order-1 lg:col-span-7">
          <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-12">
            <div className="w-8 lg:w-12 h-[1px] bg-white/20"></div>
            <h3 className="text-xs lg:text-sm font-mono tracking-widest uppercase text-[#a3a3a3]">
              Hii im abhi
            </h3>
          </div>
          <p
            ref={textRef}
            className="text-[clamp(1.3rem,5vw,2rem)] lg:text-[clamp(1.75rem,3vw,3.5rem)] leading-[1.3] lg:leading-[1.15] tracking-[-0.02em] lg:tracking-[-0.03em] font-satoshi font-light text-[#fafafa] w-full"
            style={{ textAlignLast: "left" }}
          >
            {words.map((word, i) => (
              <React.Fragment key={i}>
                <span className="word inline opacity-20 will-change-[opacity]">
                  {word}
                </span>
                {" "}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="relative order-1 col-span-12 h-[40vh] w-full overflow-hidden rounded-[2rem] shadow-2xl sm:h-[60vh] lg:order-2 lg:col-span-5 lg:h-[70vh] border border-white/10 media-uninvert">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <img
            ref={imageRef}
            src="/profile.jpg"
            alt="Abhi Profile"
            className="absolute inset-0 w-full h-full object-cover will-change-transform transform-gpu"
            onError={(e) => { e.target.src = rightPlaceholder; }}
          />
        </div>

      </div>
    </section>
  );
}
