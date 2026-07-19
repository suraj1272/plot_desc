import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { Plot } from '../types';
import PlotHotspot from './PlotHotspot';
import plotsData from '../data/plots.json';

// Cast imported JSON to Plot[]
const allPlots = plotsData as unknown as Plot[];

interface LayoutMapProps {
  onSelectPlot: (plot: Plot) => void;
  onHoverPlot: (plot: Plot | null) => void;
  hoveredPlot: Plot | null;
}

const LayoutMap: React.FC<LayoutMapProps> = ({ onSelectPlot, onHoverPlot, hoveredPlot }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [filterSurvey, setFilterSurvey] = useState<'all' | '98' | '101'>('all');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [searchPlot, setSearchPlot] = useState('');

  // Track container size for hotspot positioning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const counts = useMemo(() => ({
    all: allPlots.length,
    sy98: allPlots.filter((p) => p.surveyNo === '98').length,
    sy101: allPlots.filter((p) => p.surveyNo === '101').length,
  }), []);

  const filteredPlots = useMemo(() => {
    let plots = allPlots;
    if (filterSurvey !== 'all') plots = plots.filter((p) => p.surveyNo === filterSurvey);
    if (searchPlot.trim()) {
      const n = parseInt(searchPlot.trim());
      if (!isNaN(n)) plots = plots.filter((p) => p.number === n);
    }
    return plots;
  }, [filterSurvey, searchPlot]);

  return (
    <section id="layout" className="py-12 bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
            Shreemant Jagadevrao Deshmukh Layout
          </h2>
          <p className="text-amber-400 text-sm font-semibold tracking-wider uppercase mb-3">
            Survey No. 98 & 101, Nalatavad
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto text-xs sm:text-sm">
            Explore the master plan. Tap any plot to see full details and 3D view with dimensions from the official DTCP layout records.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Plots', value: counts.all, color: 'text-white' },
            { label: 'Survey No. 98', value: counts.sy98, color: 'text-amber-400' },
            { label: 'Survey No. 101', value: counts.sy101, color: 'text-amber-400' },
            { label: 'Available Plots', value: counts.all, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-xl md:text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-[10px] md:text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 bg-white/5 border border-white/10 rounded-xl p-3">
          {/* Survey filter */}
          <div className="flex gap-1 w-full md:w-auto">
            {([['all', 'All Surveys'], ['98', 'SY No. 98'], ['101', 'SY No. 101']] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilterSurvey(val)}
                className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filterSurvey === val
                    ? 'bg-amber-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search, Download & Info */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <input
                type="number"
                placeholder="Search plot #"
                value={searchPlot}
                onChange={(e) => setSearchPlot(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-lg pl-8 pr-3 py-2 w-full sm:w-32 focus:outline-none focus:border-amber-500/50 placeholder-gray-600"
              />
              <svg className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Download Button */}
            <a
              href="/layout_original.pdf"
              download="Shreemant_Jagadevrao_Deshmukh_Layout_Master_Plan.pdf"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-900 text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-[0.98] w-full sm:w-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Map
            </a>

            <span className="text-gray-500 text-xs whitespace-nowrap text-center sm:text-left">
              Showing {filteredPlots.length} plots
            </span>
          </div>
        </div>

        {/* Mobile Swipe Hint */}
        <div className="block lg:hidden text-center text-amber-500/80 text-[10px] uppercase font-bold tracking-widest mb-2 animate-pulse">
          ← Swipe left or right to pan layout map →
        </div>

        {/* Map scroll container (for mobile responsiveness) */}
        <div className="overflow-x-auto overflow-y-hidden max-w-full rounded-2xl border border-white/10 shadow-2xl bg-gray-900 scrollbar-thin">
          <div 
            ref={containerRef} 
            className="relative min-w-[950px] lg:min-w-0 w-full animate-fade-in" 
            style={{ aspectRatio: '1191/842' }}
          >
            {/* Master plan image */}
            <img
              src="/layout_2d.png"
              alt="Shreemant Jagadevrao Deshmukh Layout - Master Plan"
              className="w-full h-full object-contain"
              onLoad={() => {
                setImgLoaded(true);
                if (containerRef.current) {
                  const rect = containerRef.current.getBoundingClientRect();
                  setContainerSize({ width: rect.width, height: rect.height });
                }
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = '0';
                setImgLoaded(true);
              }}
            />

            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(180,142,60,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(180,142,60,0.5) 1px, transparent 1px)`,
                backgroundSize: '4% 4%',
              }}
            />

            {/* Loading */}
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Plot hotspots */}
            {containerSize.width > 0 &&
              filteredPlots.map((plot) => (
                <PlotHotspot
                  key={plot.id}
                  plot={plot}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                  onSelect={onSelectPlot}
                  onHover={onHoverPlot}
                  isHovered={hoveredPlot?.id === plot.id}
                />
              ))}
          </div>

          {/* Bottom bar */}
          <div className="bg-gray-900/90 backdrop-blur border-t border-white/10 px-4 py-2.5 flex items-center justify-between text-[11px] text-gray-500 min-w-[950px] lg:min-w-0">
            <div className="flex items-center gap-1.5 text-green-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>All Plots Available</span>
            </div>
            <span>
              Shreemant Jagadevrao Deshmukh Layout · Nalatavad
            </span>
          </div>
        </div>

        {/* Help cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { icon: '👆', title: 'Tap to Select', desc: 'Tap any plot marker to view full details, pricing, and the interactive 3D layout model.' },
            { icon: '🔍', title: 'Filter & Search', desc: 'Easily filter by Survey No. 98 or 101, or search directly for a plot number.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Easily swipe left/right to pan and view the complete layout sheet on smaller screens.' },
          ].map((card) => (
            <div key={card.title} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 items-start">
              <span className="text-xl">{card.icon}</span>
              <div>
                <div className="font-semibold text-white text-sm mb-0.5">{card.title}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{card.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LayoutMap;
