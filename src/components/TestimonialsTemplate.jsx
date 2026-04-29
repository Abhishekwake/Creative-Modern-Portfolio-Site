import React, { useState } from "react";

const testimonials = [
  {
    quote: "Abhishek completely transformed our YouTube strategy. He doesn't just edit; he engineers retention. His pacing is flawless, and his visual storytelling helped us reach",
    highlight: "over 500K+ total views across two videos.",
    name: "K9 & Charu",
    role: "YouTube Creators (1M+ Audience)",
    avatar: "/k9-charu.jpg"
  },
  {
    quote: "I needed course intro videos that would actually convert. Abhishek delivered exactly that. His edits are crisp, engaging, and structurally perfect, helping my courses reach",
    highlight: "250,000+ learners across 40+ countries.",
    name: "Imran Teli",
    role: "Top Educator & Instructor",
    avatar: "/imran.png"
  },
  {
    quote: "Finding an editor who actually understands audience psychology is rare. Abhishek takes raw footage and turns it into polished, high-performing narratives that",
    highlight: "consistently drive massive engagement.",
    name: "Anuj Bagade",
    role: "Entrepreneur",
    avatar: "/feedback-3.jpg"
  }
];

export default function TestimonialsTemplate() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="relative z-10 w-full bg-[#0a0a0a] text-[#fafafa] py-32 px-4 lg:px-8 border-t border-white/5 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="max-w-[1200px] mx-auto w-full flex flex-col items-center">
        <span className="text-[#a3a3a3] font-mono text-xs md:text-sm tracking-widest uppercase mb-12 md:mb-16 block">
          Client Feedback
        </span>

        <div className="relative w-full min-h-[350px] sm:min-h-[300px] md:min-h-[250px] flex items-center justify-center mb-8">
          {testimonials.map((test, idx) => (
            <blockquote
              key={idx}
              className={`absolute text-center text-[clamp(1.25rem,4vw,3.5rem)] font-satoshi font-light leading-[1.4] md:leading-[1.15] tracking-[-0.01em] transition-all duration-700 w-full ${currentIndex === idx
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            >
              "{test.quote} <span className="text-[#a3a3a3]">{test.highlight}</span>"
            </blockquote>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          {/* Avatar Icon */}
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 mb-2">
            {testimonials.map((test, idx) => (
              <img
                key={idx}
                src={test.avatar}
                alt={test.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${currentIndex === idx ? "opacity-100" : "opacity-0"
                  }`}
              />
            ))}
          </div>

          <div className="text-center h-16">
            <h4 className="text-xl font-medium tracking-tight transition-all duration-300">
              {current.name}
            </h4>
            <p className="text-[#a3a3a3] text-sm tracking-wide uppercase font-medium mt-1 transition-all duration-300">
              {current.role}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-12">
          <button
            onClick={prevTestimonial}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 group"
            aria-label="Previous Testimonial"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          </button>
          <div className="flex gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/20 hover:bg-white/50"
                  }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextTestimonial}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 group"
            aria-label="Next Testimonial"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
