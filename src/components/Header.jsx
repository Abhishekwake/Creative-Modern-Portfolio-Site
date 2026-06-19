import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

/** Magnetic only in the early part of scroll before expand dominates */
const MAGNETIC_OFF_SCROLL_PROGRESS = 0.12;
/** Lifts the card stack from viewport-center up to match pre–fullscreen hero layout (pt-28-ish) */
const INITIAL_CARD_FOLLOW_Y = -104;
/** Fullscreen end: soft corners (aligned with premium UI / CTA feel, not sharp 0) */
const FULLSCREEN_RADIUS = 24;
const MAGNETIC_QUICK = {
  duration: 0.28,
  ease: "power3.out",
  overwrite: "auto",
};

function useMagneticCardX({
  cardListenerRef,
  cardFollowRef,
  floatingRef,
  scrollProgressRef,
}) {
  const xToRef = useRef(null);

  useEffect(() => {
    const listener = cardListenerRef.current;
    const follow = cardFollowRef.current;
    const cardEl = floatingRef.current;
    if (!listener || !follow || !cardEl) return;

    gsap.set(follow, { x: 0, force3D: true });

    xToRef.current = gsap.quickTo(follow, "x", {
      ...MAGNETIC_QUICK,
      force3D: true,
    });
    const xTo = xToRef.current;

    let rafId = null;
    let latestClientX = 0;

    const applyMagnetic = () => {
      if (scrollProgressRef.current > MAGNETIC_OFF_SCROLL_PROGRESS) return;

      const cw = cardEl.offsetWidth;
      const winWidth = window.innerWidth;

      // How far the card's center can travel to touch the screen edges
      const travel = (winWidth - cw) / 2;

      if (travel <= 0) {
        xTo(0);
        return;
      }

      // Cursor offset globally clamped to screen width
      const clampedX = gsap.utils.clamp(0, winWidth, latestClientX);

      // Map global [0 → winWidth] to [-travel → +travel]
      const x = (clampedX / winWidth) * (travel * 2) - travel;
      xTo(Math.round(x * 100) / 100);
    };

    const onMove = (e) => {
      // Ignore if scrolling down far enough
      if (scrollProgressRef.current > MAGNETIC_OFF_SCROLL_PROGRESS) return;
      latestClientX = e.clientX;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyMagnetic();
      });
    };

    const onLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      xTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    // Keep a transparent listener over the area to handle pointerleave just in case the mouse leaves the document
    document.addEventListener("pointerleave", onLeave);

    const onResize = () => {
      if (scrollProgressRef.current <= MAGNETIC_OFF_SCROLL_PROGRESS) {
        xTo(0);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      xToRef.current = null;
    };
  }, [cardFollowRef, floatingRef, scrollProgressRef]);

  return xToRef;
}

export default function Hero() {
  /** Single hero shell: trigger + pin target (avoids nested 100vh = blank band) */
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLightMode, setIsLightMode] = useState(false);
  const sectionRef = useRef(null);
  const cardTrackRef = useRef(null);
  const cardListenerRef = useRef(null);
  const cardFollowRef = useRef(null);
  const floatingRef = useRef(null);
  const imgRef = useRef(null);
  const headlineRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const headerStripRef = useRef(null);
  const headerCtaRef = useRef(null);

  const xToRef = useMagneticCardX({
    cardListenerRef,
    cardFollowRef,
    floatingRef,
    scrollProgressRef,
  });

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  }, [isLightMode]);

  const toggleVideoMute = () => {
    const v = imgRef.current;
    if (!v) return;
    const nextMuted = !isMuted;
    v.muted = nextMuted;
    if (!nextMuted) {
      v.volume = 1;
      v.play().catch(() => { });
    }
    setIsMuted(nextMuted);
  };

  useEffect(() => {
    const v = imgRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (!isMuted) {
      v.play().catch(() => {
        // If autoplay with sound is blocked, keep video visible and playing muted.
        v.muted = true;
        setIsMuted(true);
        v.play().catch(() => { });
      });
    }
  }, [isMuted]);

  /* ---------- Lenis + GSAP ticker ---------- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    const ticker = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.scrollerProxy(document.documentElement, null);
    };
  }, []);

  /* ---------- Scroll: card expands to fullscreen (scrub) on desktop, static on mobile ---------- */
  useEffect(() => {
    const card = floatingRef.current;
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const img = imgRef.current;
    const follow = cardFollowRef.current;
    if (!card || !section || !headline || !img || !follow) return;

    const mm = gsap.matchMedia();

    mm.add({
      isMobile: "(max-width: 767px)",
      isDesktop: "(min-width: 768px)"
    }, (context) => {
      const { isMobile, isDesktop } = context.conditions;

      // Center card statically on mobile, offset it on desktop
      gsap.set(follow, { x: 0, xPercent: 0, y: isMobile ? 0 : INITIAL_CARD_FOLLOW_Y });

      // Mobile: landscape video (16:9 aspect ratio)
      // Desktop: landscape video (16:9 aspect ratio)
      const isLandscape = true; // Always landscape

      gsap.set(card, {
        transformOrigin: "50% 50%",
        marginLeft: 0,
        marginRight: 0,
        position: "relative",
        left: "auto",
        top: "auto",
        xPercent: 0,
        yPercent: 0,
        // Landscape: width is full, height adjusts to 16:9 aspect ratio
        width: isMobile ? "calc(100vw - 2rem)" : "680px",
        height: isMobile ? "calc((100vw - 2rem) * 9 / 16)" : "380px", // Changed to 9/16 for landscape
        borderRadius: 10,
        opacity: 1,
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
      });

      gsap.set(img, {
        scale: 1,
        filter: "brightness(1) blur(0px)",
        transformOrigin: "center center",
      });

      const strip = headerStripRef.current;
      const cta = headerCtaRef.current;
      if (strip) gsap.set(strip, { autoAlpha: 1, y: 0 });
      if (cta) gsap.set(cta, { autoAlpha: 1, y: 0 });

      if (isDesktop) {
        const hideHeaderBar = () => {
          const targets = [strip].filter(Boolean);
          if (!targets.length) return;
          gsap.killTweensOf(targets);
          gsap.to(targets, {
            autoAlpha: 0,
            y: -28,
            duration: 0.55,
            ease: "power3.inOut",
            stagger: 0.04,
            overwrite: "auto",
            onComplete: () => {
              targets.forEach((el) => {
                if (el) el.setAttribute("aria-hidden", "true");
              });
            },
          });
        };

        const showHeaderBar = () => {
          const targets = [strip].filter(Boolean);
          if (!targets.length) return;
          gsap.killTweensOf(targets);
          targets.forEach((el) => {
            el.removeAttribute("aria-hidden");
          });
          gsap.to(targets, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.05,
            overwrite: "auto",
          });
        };

        let lastProgress = 0;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=55%",
            scrub: 1,
            pin: section,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              scrollProgressRef.current = p;
              if (
                lastProgress <= MAGNETIC_OFF_SCROLL_PROGRESS &&
                p > MAGNETIC_OFF_SCROLL_PROGRESS &&
                xToRef.current
              ) {
                xToRef.current(0);
              }
              lastProgress = p;
            },
            onLeave: hideHeaderBar,
            onEnterBack: showHeaderBar,
          },
        });

        tl.to(
          follow,
          {
            y: 0,
            ease: "power3.inOut",
            duration: 1,
          },
          0
        );

        tl.to(
          card,
          {
            width: "100vw",
            height: "100svh",
            borderRadius: FULLSCREEN_RADIUS,
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
            ease: "power3.inOut",
            duration: 1,
          },
          0
        );

        tl.to(
          headline,
          {
            y: -140,
            opacity: 0,
            filter: "blur(8px)",
            ease: "power3.in",
            duration: 0.55,
          },
          0
        );

        tl.to(
          img,
          {
            scale: 1.06,
            filter: "brightness(0.7) blur(3px)",
            ease: "power2.inOut",
            duration: 0.45,
          },
          0
        );

        tl.to(
          img,
          {
            scale: 1,
            filter: "brightness(0.9) blur(0px)",
            ease: "power3.out",
            duration: 0.55,
          },
          0.45
        );

        requestAnimationFrame(() => {
          const r = section.getBoundingClientRect();
          if (r.bottom <= 64) hideHeaderBar();
        });
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  /* ---------- Subtle hover scale (listener) ---------- */
  useEffect(() => {
    const el = floatingRef.current;
    const listener = cardListenerRef.current;
    if (!el || !listener) return;

    const onEnter = () => {
      gsap.to(el, {
        scale: 1.015,
        duration: 0.5,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      });
    };
    const onLeave = () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
        force3D: true,
      });
    };

    listener.addEventListener("pointerenter", onEnter);
    listener.addEventListener("pointerleave", onLeave);
    return () => {
      listener.removeEventListener("pointerenter", onEnter);
      listener.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[2px] bg-white/5 z-[9999] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-neutral-500 via-neutral-200 to-white will-change-[width] transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <header className="pointer-events-none [&_a]:pointer-events-auto [&_div]:pointer-events-auto [&_button]:pointer-events-auto">
        <div
          ref={headerStripRef}
          className="fixed left-4 lg:left-8 right-4 lg:right-8 top-4 lg:top-6 grid grid-cols-12 gap-4 lg:gap-8 z-50 text-[#fafafa] items-center"
        >

          <div className="col-span-6 lg:col-span-3 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-black shrink-0 relative">
              <img
                src="/profile.jpg"
                alt="Profile Icon"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="font-medium text-[clamp(16px,1.2vw,20px)] tracking-tight">Abhishek Wake</span>
          </div>

          <div className="hidden lg:flex col-span-4 flex-col justify-center">
            <span className="block overflow-hidden"><div className="block font-medium text-[clamp(16px,1.2vw,20px)]" style={{ transform: "none" }}>Video Editor & Stratergist</div></span>
            <span className="block overflow-hidden"><div className="block font-medium text-[#a3a3a3] text-[clamp(16px,1.2vw,20px)]" style={{ transform: "none" }}>Available for freelance</div></span>
          </div>

          <div className="hidden lg:flex col-span-3 flex-col justify-center">
            <span className="block overflow-hidden"><div className="block font-medium text-[clamp(16px,1.2vw,20px)]" style={{ transform: "none" }}>Project availability</div></span>
            <span className="block overflow-hidden"><div className="block font-medium text-[#a3a3a3] text-[clamp(16px,1.2vw,20px)]" style={{ transform: "none" }}>Accepting now</div></span>
          </div>

          <div className="col-span-6 lg:col-span-2 flex justify-end items-center gap-3">
            <button
              onClick={() => setIsLightMode(!isLightMode)}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300 media-uninvert z-10"
              aria-label="Toggle theme"
            >
              {isLightMode ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              )}
            </button>
            <a ref={headerCtaRef} href="mailto:abhishekwake111@gmail.com" className="group cursor-pointer pointer-events-auto relative media-uninvert" aria-label="Send us an email" role="button" style={{ opacity: 1, transform: "none" }}>
              <div className="absolute left-0 top-0 w-12 3xl:w-14 h-12 3xl:h-14 bg-white border border-white/10 rounded-full flex items-center justify-center rotate-180 scale-95 group-hover:scale-100 group-hover:rotate-0 group-hover:-translate-x-full transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] -z-10">
                <span className="text-lg lg:text-xl 3xl:text-2xl">🤙🏼</span>
              </div>
              <div className="flex items-center relative px-5 lg:px-6 h-12 lg:h-14 rounded-full bg-white text-black font-semibold text-[clamp(16px,1.2vw,20px)] border border-white/10 z-10">
                <div className="overflow-hidden h-6 lg:h-7">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1/2">
                    <span className="text-[clamp(16px,1.2vw,20px)] text-black font-semibold mb-1.5 leading-snug">Hire Me</span>
                    <span className="text-[clamp(16px,1.2vw,20px)] text-black font-semibold mb-1.5 leading-snug">Hire Me</span>
                  </div>
                </div>
              </div>
            </a>
          </div>

        </div>
      </header>

      <section
        ref={sectionRef}
        className="relative z-10 min-h-screen md:h-[100svh] w-full overflow-hidden [contain:layout_paint] bg-[#0a0a0a] isolate flex flex-col items-center justify-center pt-16 pb-8 md:pt-0 md:pb-0 gap-4 md:gap-0"
      >
        <div className="absolute bottom-0 left-0 right-0 h-[0%] bg-gradient-to-t from-[#0a0a0a] to-transparent z-[1]" />

        <div className="relative md:absolute md:inset-0 z-[5] flex items-center justify-center pointer-events-none px-4 lg:px-8 w-full">
          <div
            ref={cardTrackRef}
            className="pointer-events-auto relative w-full max-w-[min(1100px,calc(100vw-2rem))] min-h-[min(200px,30vh)] md:min-h-[min(380px,48vh)] flex items-center justify-center"
          >
            {/* Card listener - now allows scroll through on mobile */}
            <div
              ref={cardListenerRef}
              className="absolute inset-0 z-30 touch-none md:touch-auto cursor-pointer md:cursor-pointer"
              onClick={toggleVideoMute}
              aria-hidden
              style={{ touchAction: 'pan-y' }}
            />
            <div
              ref={cardFollowRef}
              className="relative z-20 flex shrink-0 will-change-transform [transform:translateZ(0)]"
            >
              <div
                ref={floatingRef}
                className="relative shrink-0 w-[min(680px,calc(100vw-2rem))] aspect-[9/16] md:aspect-[16/9] md:h-[min(380px,48vh)] max-w-[100vw] overflow-hidden rounded-[10px] will-change-[width,height,transform,opacity] shadow-sm [backface-visibility:hidden] border border-white/5 media-uninvert"
              >
                <video
                  ref={imgRef}
                  src="/heromainvideo.mp4"
                  className="h-full w-full object-cover object-center pointer-events-none select-none"
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  preload="auto"
                  poster="/hero-bg.jpg"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute top-3 right-3 z-40 text-[18px] leading-none text-white drop-shadow-md"
                  aria-hidden="true"
                >
                  {isMuted ? "🔇" : "🔊"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative md:absolute md:bottom-20 lg:bottom-20 left-0 right-0 px-4 lg:px-8 pointer-events-none [&_.headline-hit]:pointer-events-auto w-full z-10 mt-2 md:mt-0">
          <div
            ref={headlineRef}
            className="headline-hit col-span-12 w-full will-change-transform"
          >
            <div className="grid grid-cols-12 items-end gap-x-2">
              <span className="font-medium col-span-3 mb-2 lg:mb-6 text-[clamp(10px,2.5vw,20px)] uppercase tracking-widest text-[#a3a3a3]">
                A
              </span>
              <span className="font-medium col-span-6 mb-2 lg:mb-6 text-center text-[clamp(10px,2.5vw,20px)] uppercase tracking-widest text-[#a3a3a3]">
                Seriously
              </span>
              <span className="font-medium col-span-3 mb-2 lg:mb-6 text-right text-[clamp(10px,2.5vw,20px)] uppercase tracking-widest text-[#a3a3a3]">
                Good
              </span>

              <h1 className="col-span-12 text-center font-satoshi font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#fafafa] text-[clamp(2.5rem,10vw,12rem)] max-w-[min(100%,calc(100vw-2rem))] mx-auto whitespace-normal sm:whitespace-nowrap drop-shadow-2xl">
                Video Editor
              </h1>
            </div>
          </div>

          <div className="absolute bottom-8 left-4 lg:left-8 text-sm font-mono tracking-widest uppercase text-[#a3a3a3] hidden md:block">
            Scroll
          </div>
        </div>
      </section>
    </>
  );
}