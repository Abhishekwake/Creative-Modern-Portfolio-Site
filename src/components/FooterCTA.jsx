import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MAIL = "abhishekwake111@gmail.com";
const WHATSAPP_DIGITS =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_WHATSAPP_DIGITS
    ? String(import.meta.env.VITE_WHATSAPP_DIGITS).replace(/\D/g, "")
    : "";

/** WhatsApp URL — uses VITE_WHATSAPP_DIGITS or falls back to your number. */
function whatsappHref() {
  const digits = WHATSAPP_DIGITS || "918080127679";
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hi — I'd like to talk about content."
  )}`;
}

export default function FooterCTA() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const blocks = root?.querySelectorAll(".cta-reveal");
      if (!root || !blocks?.length) return;
      gsap.fromTo(
        blocks,
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
      className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 md:py-48 px-4 lg:px-8 border-t border-white/5 flex flex-col items-center justify-center text-center"
    >
      <div className="mx-auto max-w-[min(960px,calc(100vw-2rem))]">
        <h2 className="cta-reveal font-satoshi text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.04em] text-[#fafafa] mb-8">
          Let&apos;s build content that grows your brand.
        </h2>
        <p className="cta-reveal mx-auto max-w-xl font-satoshi text-lg md:text-xl font-light leading-[1.6] text-[#a3a3a3] mb-16">
          If you&apos;re serious about results — let&apos;s talk.
        </p>

        <div className="cta-reveal mx-auto flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
          <a
            href={`mailto:${MAIL}`}
            className="group relative inline-flex h-14 min-w-[220px] items-center justify-center rounded-full bg-white px-9 font-satoshi text-lg font-medium text-black transition-transform duration-500 will-change-transform hover:-translate-y-1"
          >
            <span className="relative z-10">Start a Project</span>
            <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-20 blur-md transition-opacity duration-500 group-hover:opacity-40"></div>
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 min-w-[220px] items-center justify-center rounded-full border border-white/20 bg-transparent px-9 font-satoshi text-lg font-medium text-[#fafafa] transition-all duration-500 hover:-translate-y-1 hover:border-white/40 hover:bg-white/5"
          >
            WhatsApp Me
          </a>
        </div>
      </div>
      
      {/* Footer minimal signature */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center text-xs font-mono tracking-widest uppercase text-[#a3a3a3] opacity-50">
        © {new Date().getFullYear()} Abhishekwake.in
      </div>
    </section>
  );
}
