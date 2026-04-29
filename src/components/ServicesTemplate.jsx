import React from "react";

export default function ServicesTemplate() {
  const services = [
    {
      title: "Brand Identity",
      description: "Crafting visually striking and conceptually robust brand identities that resonate and endure.",
    },
    {
      title: "Digital Design",
      description: "Designing seamless, high-performance digital experiences with a focus on conversion and aesthetics.",
    },
    {
      title: "Motion & Interaction",
      description: "Breathing life into static designs through purposeful, buttery-smooth animations.",
    },
    {
      title: "Creative Direction",
      description: "Guiding the holistic visual language and strategic positioning of your product or brand.",
    },
  ];

  return (
    <section className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 px-4 lg:px-8 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-satoshi font-light leading-tight tracking-[-0.04em]">
            Capabilities.
          </h2>
          <p className="text-[#a3a3a3] text-lg md:text-xl max-w-md font-light leading-relaxed">
            A comprehensive suite of services designed to elevate your brand to the highest standard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group flex flex-col gap-6 pt-8 border-t border-white/10 hover:border-white/40 transition-colors duration-500"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-[#a3a3a3] font-mono tracking-widest uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 text-white">
                  ↗
                </span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-medium mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-[#a3a3a3] text-lg leading-relaxed font-light">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
