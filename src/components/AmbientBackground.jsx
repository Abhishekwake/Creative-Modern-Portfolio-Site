import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#050505]">
      {/* Lightning Blue / Deep Indigo Fluid Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-600/10 blur-[150px] mix-blend-screen animate-fluid"></div>
      
      <div className="absolute top-[30%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[150px] mix-blend-screen animate-fluid delay-2000"></div>
      
      <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-cyan-600/10 blur-[150px] mix-blend-screen animate-fluid delay-4000"></div>
    </div>
  );
}
