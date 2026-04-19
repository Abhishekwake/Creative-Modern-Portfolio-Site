import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const MIN_MS = 1200;
const MAX_WAIT_MS = 4500;

/**
 * Full-viewport 0→100 loader: white canvas, smooth GSAP progress, exit after load + minimum time.
 */
export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const [display, setDisplay] = useState(0);
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    let cancelled = false;
    document.body.style.overflow = "hidden";

    const loadDone = new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    const fontsDone = document.fonts.ready.catch(() => {});

    const minTime = new Promise((r) => setTimeout(r, MIN_MS));

    const mainTween = gsap.to(progressObj.current, {
      value: 88,
      duration: 1.85,
      ease: "power2.out",
      onUpdate: () => {
        if (!cancelled) {
          setDisplay(Math.min(100, Math.round(progressObj.current.value)));
        }
      },
    });

    const capWait = new Promise((r) => setTimeout(r, MAX_WAIT_MS));

    let finishTween;

    Promise.race([
      Promise.all([loadDone, fontsDone, minTime]),
      capWait,
    ]).then(() => {
      if (cancelled) return;
      mainTween.kill();
      finishTween = gsap.to(progressObj.current, {
        value: 100,
        duration: 0.55,
        ease: "power3.out",
        onUpdate: () => {
          if (!cancelled) {
            setDisplay(Math.round(progressObj.current.value));
          }
        },
        onComplete: () => {
          if (cancelled) return;
          setDisplay(100);

          gsap.to(innerRef.current, {
            opacity: 0,
            y: -12,
            duration: 0.5,
            ease: "power3.in",
          });

          gsap.to(wrapRef.current, {
            opacity: 0,
            duration: 0.65,
            delay: 0.08,
            ease: "power2.inOut",
            onComplete: () => {
              if (cancelled) return;
              setVisible(false);
              document.body.style.overflow = "";
            },
          });
        },
      });
    });

    return () => {
      cancelled = true;
      mainTween.kill();
      finishTween?.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      aria-hidden={false}
      aria-label="Loading"
    >
      <div
        ref={innerRef}
        className="flex flex-col items-center gap-6 select-none"
      >
        <div
          className="font-satoshi font-medium tabular-nums tracking-[-0.02 em] text-neutral-800"
          style={{ fontSize: "clamp(1rem, 0.5vw, 7rem)", lineHeight: 1 }}
        >
          {String(display).padStart(2, "0")}
        </div>

        
      </div>
    </div>
  );
}
