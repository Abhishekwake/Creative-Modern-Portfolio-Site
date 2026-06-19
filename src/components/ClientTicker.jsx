import React from "react";

const TICKER_ITEMS = [
  "K9 Vines (1M+ Audience)",
  "Imran Teli (250K+ Learners)",
  "Reaching 40+ Countries",
  "High-Converting Content ROI",
  "Retention-Driven Editing",
  "Visual Strategy & Rhythm",
];

/**
 * Premium Infinite Marquee Ticker.
 * Showcases credibility highlights in a seamless horizontal loop.
 */
export default function ClientTicker() {
  // Quadruple items to make sure the loop fills screen width comfortably before animating
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section className="relative z-10 w-full overflow-hidden border-y border-white/5 bg-[#080808] py-8 select-none">
      <div className="flex w-full overflow-hidden pointer-events-none">
        <div className="animate-marquee flex gap-16 items-center whitespace-nowrap">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-16 font-satoshi text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-white/40">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/15 shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
