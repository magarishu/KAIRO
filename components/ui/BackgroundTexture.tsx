import React from 'react';

export function BackgroundTexture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#05010D]">
      
      {/* 
        PREMIUM GLASSMORPHISM MESH GRADIENT
        Built by a Senior UI/UX Dev: 
        These are massive, highly-blurred, slow-moving light orbs that create
        a completely organic, high-end fluid gradient effect inside the DOM. 
      */}

      {/* Orb 1: Deep Violet - Top Left */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-[#4C1D95]/30 blur-[140px] mix-blend-screen opacity-60"
        style={{ animation: 'float-slow 20s ease-in-out infinite alternate' }}
      />
      
      {/* Orb 2: Electric Indigo - Bottom Right */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-[#312E81]/40 blur-[150px] mix-blend-screen opacity-80"
        style={{ animation: 'float-slower 25s ease-in-out infinite alternate-reverse' }}
      />

      {/* Orb 3: Soft Fuchsia core - Center moving */}
      <div 
        className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#9333EA]/20 blur-[130px] mix-blend-screen opacity-50"
        style={{ animation: 'float-drifting 30s ease-in-out infinite alternate' }}
      />
      
      {/* Orb 4: Vibrant Cyan Patch - Top Right */}
      <div 
        className="absolute top-[10%] right-[10%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full bg-[#06B6D4]/15 blur-[120px] mix-blend-screen opacity-40"
        style={{ animation: 'float-drifting 22s ease-in-out infinite alternate-reverse' }}
      />

      {/* Orb 5: Hot Pink Patch - Bottom Left */}
      <div 
        className="absolute bottom-[20%] left-[10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-[#EC4899]/15 blur-[140px] mix-blend-screen opacity-40"
        style={{ animation: 'float-slow 28s ease-in-out infinite alternate' }}
      />

      {/* Edge Shadow / Vignette for dramatic focus */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#05010D_110%)] opacity-90" />

      {/* Premium UI/UX Film Grain (Matte Finish) */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* 
        Add custom keyframes inline just for this background to keep it completely self-contained
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 8%) scale(1.05); }
          100% { transform: translate(-3%, 5%) scale(0.95); }
        }
        @keyframes float-slower {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8%, -5%) scale(0.95); }
          100% { transform: translate(3%, -8%) scale(1.05); }
        }
        @keyframes float-drifting {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15%, -10%) scale(1.1); }
          66% { transform: translate(-10%, 15%) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}} />
    </div>
  );
}
