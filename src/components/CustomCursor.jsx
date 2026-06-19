import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Premium custom magnetic mouse cursor.
 * Features a hardware-accelerated ring follower that smoothly tracks the pointer
 * and reacts dynamically to links, buttons, and selected work cards.
 * Automatically disables itself on touch screens and mobile viewports.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isMobile, setIsMobile] = useState(true);
  const [cursorText, setCursorText] = useState("");

  useEffect(() => {
    const checkTouch = () => {
      const touchCapable =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth < 768;
      setIsMobile(touchCapable);
    };

    checkTouch();
    window.addEventListener("resize", checkTouch);

    if (isMobile) {
      return () => {
        window.removeEventListener("resize", checkTouch);
      };
    }

    // Set initial position centered out of view
    gsap.set(dotRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(ringRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

    // GSAP quickTo for high performance tracking
    const dotX = gsap.quickTo(dotRef.current, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dotRef.current, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ringRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ringRef.current, "y", { duration: 0.35, ease: "power3.out" });

    let hasMoved = false;

    const onMouseMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      
      if (!hasMoved) {
        hasMoved = true;
        gsap.to([dotRef.current, ringRef.current], { opacity: 1, duration: 0.25, overwrite: "auto" });
      }
    };

    const onMouseLeaveWindow = () => {
      gsap.to([dotRef.current, ringRef.current], { opacity: 0, duration: 0.25, overwrite: "auto" });
      hasMoved = false;
    };

    const onMouseEnterWindow = () => {
      // Don't flash immediately, wait for movement
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeaveWindow);
    document.addEventListener("mouseenter", onMouseEnterWindow);

    // Dynamic Hover Animations
    const onMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], .cursor-pointer");
      const workCard = target.closest(".work-grid-card");

      if (workCard) {
        setCursorText("PLAY");
        gsap.to(ringRef.current, {
          width: 56,
          height: 56,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderColor: "rgba(255, 255, 255, 1)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dotRef.current, {
          scale: 0,
          duration: 0.2,
          overwrite: "auto",
        });
      } else if (interactive) {
        setCursorText("");
        gsap.to(ringRef.current, {
          width: 48,
          height: 48,
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          borderColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dotRef.current, {
          scale: 1.5,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };

    const onMouseOut = (e) => {
      const target = e.target;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], .cursor-pointer");
      const workCard = target.closest(".work-grid-card");

      if (!interactive && !workCard) {
        setCursorText("");
        gsap.to(ringRef.current, {
          width: 32,
          height: 32,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.45)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dotRef.current, {
          scale: 1,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };

    document.addEventListener("pointerover", onMouseOver);
    document.addEventListener("pointerout", onMouseOut);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeaveWindow);
      document.removeEventListener("mouseenter", onMouseEnterWindow);
      document.removeEventListener("pointerover", onMouseOver);
      document.removeEventListener("pointerout", onMouseOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 z-[9999] pointer-events-none h-1.5 w-1.5 rounded-full bg-white opacity-0 mix-blend-difference will-change-transform"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 z-[9999] pointer-events-none flex h-8 w-8 items-center justify-center rounded-full border border-white/45 bg-transparent opacity-0 mix-blend-difference will-change-[transform,width,height,background-color,border-color]"
      >
        {cursorText && (
          <span className="font-mono text-[9px] font-bold tracking-widest text-black select-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
