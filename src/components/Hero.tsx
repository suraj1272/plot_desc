import React from 'react';

const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-950"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,142,60,0.15)_0%,_rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(180,142,60,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(180,142,60,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo mark */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-amber-500/60 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm shadow-2xl shadow-amber-500/20">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
                <span className="text-gray-900 font-black text-2xl tracking-tight">SM</span>
              </div>
            </div>
            {/* Orbiting rings */}
            <div className="absolute inset-0 rounded-full border border-amber-500/20 scale-[1.4] animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-0 rounded-full border border-amber-500/10 scale-[1.8]" />
          </div>
        </div>

        {/* Developer name */}
        <p className="text-amber-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3">
          Shree Mata Developers
        </p>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
          Shreemant Jagadevrao{' '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Deshmukh Layout
          </span>
        </h1>

        {/* Sub-tagline */}
        <p className="text-lg md:text-xl text-gray-300 font-light mb-2">
          Building Trust.{' '}
          <span className="text-amber-400 font-medium">Creating Futures.</span>
        </p>
        <p className="text-gray-400 text-sm md:text-base mb-10 max-w-2xl mx-auto">
          Premium DTCP-approved plotted development at Nalatavad — Survey No. 98 &amp; 101 — where every plot is a promise of prosperity.
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
          {[
            { value: '462+', label: 'Total Plots' },
            { value: 'SY 98 & 101', label: 'Survey Numbers' },
            { value: '15+', label: 'Years Experience' },
            { value: '500+', label: 'Happy Families' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-black text-amber-400 mb-1">{stat.value}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#layout"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View Master Plan
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            About the Builder
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-gray-500 text-xs uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
