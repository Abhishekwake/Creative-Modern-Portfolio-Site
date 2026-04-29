import React from "react";

export default function ProcessTemplate() {
  const steps = [
    {
      phase: "Phase 1",
      title: "Discovery",
      desc: "Deep diving into your brand's ethos, goals, and target audience to lay a rock-solid foundation."
    },
    {
      phase: "Phase 2",
      title: "Strategy & Art Direction",
      desc: "Defining the visual language, wireframing the architecture, and establishing the creative direction."
    },
    {
      phase: "Phase 3",
      title: "Execution",
      desc: "Pixel-perfect design and buttery-smooth development using cutting-edge technologies."
    },
    {
      phase: "Phase 4",
      title: "Refinement & Launch",
      desc: "Rigorous testing, micro-interaction polishing, and a seamless deployment process."
    }
  ];

  return (
    <section className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 px-4 lg:px-8 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-24 flex items-center gap-8">
          <div className="w-12 h-[1px] bg-white/20"></div>
          <h2 className="text-sm font-mono tracking-widest uppercase text-[#a3a3a3]">Our Methodology</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="text-[#333333] text-7xl md:text-8xl font-black tracking-tighter mb-8 group-hover:text-white/20 transition-colors duration-700">
                {idx + 1}
              </div>
              <h4 className="text-xs text-[#a3a3a3] font-mono tracking-widest uppercase mb-4">
                {step.phase}
              </h4>
              <h3 className="text-2xl font-medium mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="text-[#a3a3a3] font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
