import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CloudinaryPlayerEmbed from "./CloudinaryPlayerEmbed";
import CloudinarySdkPlayer from "./CloudinarySdkPlayer";
import { SELECTED_PROJECTS } from "./selectedWorkData";

gsap.registerPlugin(ScrollTrigger);

function chunkProjects(items, chunkSize = 3) {
  const out = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    out.push(items.slice(i, i + chunkSize));
  }
  return out;
}

function youtubeEmbedSrc(project) {
  const qs = new URLSearchParams({
    rel: "0",
    /** Playback starts after the user tapped “Play”; unmuted autoplay follows that gesture where allowed. */
    autoplay: "1",
    mute: "0",
  });
  if (project.startSeconds != null && project.startSeconds > 0) {
    qs.set("start", String(project.startSeconds));
  }
  return `https://www.youtube-nocookie.com/embed/${project.youtubeId}?${qs}`;
}

function WorkCard({ project }) {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const lastOpenTime = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const open = () => {
    lastOpenTime.current = Date.now();
    /** Commit player in the same synchronous turn as the tap so autoplay-with-audio aligns with user activation. */
    flushSync(() => {
      setLoaded(true);
    });
  };

  const close = (e) => {
    e?.stopPropagation();
    if (Date.now() - lastOpenTime.current < 400) return;
    setLoaded(false);
  };

  const showInlinePlayer = loaded && !isMobile;

  const cardChrome =
    "relative w-full min-w-0 overflow-hidden rounded-[18px] border border-white/10 bg-[#121212] transition-[transform,box-shadow,border-color] duration-500 ease-out will-change-transform active:translate-y-0 group-hover:-translate-y-2 group-hover:scale-[1.01] group-hover:border-white/20 md:rounded-[22px] touch-pan-y";

  return (
    <article className="group work-grid-card flex w-full min-w-0 flex-col select-none justify-self-stretch text-left touch-pan-y">
      {/* Poster uses <button>; iframe/video are siblings — interactive content must not be nested inside <button>. */}
      <div className={cardChrome}>
        <div className="relative aspect-video w-full overflow-hidden rounded-[inherit] bg-black touch-pan-y">
          {!showInlinePlayer ? (
            <>
              <img
                src={project.thumbSrc}
                alt=""
                className="pointer-events-none h-full w-full object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 font-satoshi text-xs font-medium uppercase tracking-[0.12em] text-white backdrop-blur-md opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                Play reel
              </span>
              <button
                type="button"
                aria-label={`Play reel — ${project.creator}`}
                onClick={open}
                className="absolute inset-0 z-10 rounded-[inherit] outline-none ring-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black touch-pan-y"
              />
            </>
          ) : project.kind === "youtube" ? (
            <div className="absolute inset-0 z-[1] bg-black">
              <iframe
                title={`${project.creator} video`}
                className="h-full w-full rounded-[inherit] border-0"
                src={youtubeEmbedSrc(project)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ) : project.kind === "cloudinary-sdk" &&
            project.cloudName &&
            project.publicId ? (
            <div className="absolute inset-0 z-10 flex min-h-0 items-stretch bg-black">
              <CloudinarySdkPlayer
                cloudName={project.cloudName}
                publicId={project.publicId}
                poster={project.thumbSrc}
              />
            </div>
          ) : project.kind === "cloudinary" &&
            (project.deliveryUrl || (project.cloudName && project.publicId)) ? (
            <div className="absolute inset-0 z-10 flex min-h-0 items-stretch bg-black">
              <CloudinaryPlayerEmbed
                deliveryUrl={project.deliveryUrl}
                cloudName={project.cloudName}
                publicId={project.publicId}
                posterSrc={project.thumbSrc}
              />
            </div>
          ) : project.videoUrl ? (
            <video
              controls
              playsInline
              preload="auto"
              autoPlay
              className="h-full w-full object-cover"
              src={project.videoUrl}
            >
              <track kind="captions" />
            </video>
          ) : null}
        </div>
      </div>
      <div className="mt-8 px-1">
        <p className="font-satoshi text-2xl font-light tracking-tight text-[#fafafa] mb-2">
          {project.creator}
        </p>
        <p className="font-satoshi max-w-[34ch] text-lg font-light leading-relaxed text-[#a3a3a3]">
          {project.audience}
        </p>
        {loaded && !isMobile ? (
          <button
            type="button"
            onClick={(e) => close(e)}
            className="mt-4 font-satoshi text-sm font-medium text-[#a3a3a3] underline-offset-8 transition-colors hover:text-white hover:underline"
          >
            Close player
          </button>
        ) : null}
      </div>

      {/* Modal/Lightbox for Mobile devices */}
      {isMobile && loaded && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] backdrop-blur-md p-4 animate-fade-in"
          onClick={close}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(e); }}
            className="absolute top-6 right-6 z-[110] flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all active:scale-95"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative w-[90vw] max-w-[640px] aspect-video overflow-hidden rounded-[24px] border border-white/15 bg-black shadow-2xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {project.kind === "youtube" ? (
              <div className="absolute inset-0 z-[1] bg-black">
                <iframe
                  title={`${project.creator} video`}
                  className="h-full w-full rounded-[inherit] border-0"
                  src={youtubeEmbedSrc(project)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : project.kind === "cloudinary-sdk" &&
              project.cloudName &&
              project.publicId ? (
              <div className="absolute inset-0 z-10 flex min-h-0 items-stretch bg-black animate-fade-in">
                <CloudinarySdkPlayer
                  cloudName={project.cloudName}
                  publicId={project.publicId}
                  poster={project.thumbSrc}
                />
              </div>
            ) : project.kind === "cloudinary" &&
              (project.deliveryUrl || (project.cloudName && project.publicId)) ? (
              <div className="absolute inset-0 z-10 flex min-h-0 items-stretch bg-black animate-fade-in">
                <CloudinaryPlayerEmbed
                  deliveryUrl={project.deliveryUrl}
                  cloudName={project.cloudName}
                  publicId={project.publicId}
                  posterSrc={project.thumbSrc}
                />
              </div>
            ) : project.videoUrl ? (
              <video
                controls
                playsInline
                preload="auto"
                autoPlay
                className="h-full w-full object-cover"
                src={project.videoUrl}
              >
                <track kind="captions" />
              </video>
            ) : null}
          </div>

          <div className="mt-6 text-center max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <p className="font-satoshi text-xl font-light text-white mb-1">
              {project.creator}
            </p>
            <p className="font-satoshi text-sm font-light text-[#a3a3a3]">
              {project.audience}
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

export default function SelectedWork() {
  const wrapRef = useRef(null);
  const headRef = useRef(null);
  const gridWrapRef = useRef(null);

  const rows = chunkProjects(SELECTED_PROJECTS, 3);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      const cards =
        gridWrapRef.current?.querySelectorAll(".work-grid-card") ?? [];
      if (cards.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridWrapRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 lg:py-40 border-t border-white/5"
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div ref={headRef} className="mb-20 w-full sm:mb-24">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-12 h-[1px] bg-white/20"></div>
            <p className="font-mono text-sm uppercase tracking-widest text-[#a3a3a3]">
              Portfolio
            </p>
          </div>
          <h2 className="font-satoshi text-[clamp(3rem,6vw,5rem)] font-light leading-tight tracking-[-0.04em] text-[#fafafa]">
            Selected Work
          </h2>
          <p className="font-satoshi mt-6 max-w-2xl text-xl md:text-2xl font-light leading-relaxed text-[#a3a3a3]">
            Content built for attention, retention, and results.
          </p>
        </div>

        <div
          ref={gridWrapRef}
          className="flex w-full flex-col items-stretch gap-14 pb-8 sm:gap-16 lg:gap-24"
        >
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid w-full grid-cols-1 items-stretch justify-items-stretch gap-x-8 gap-y-16 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-20 xl:gap-x-16"
            >
              {row.map((p) => (
                <WorkCard key={p.id} project={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
