import React, { useRef, useState, useEffect, useMemo } from 'react';
import type { Plot, PlotStatus } from '../types';
import PlotHotspot from './PlotHotspot';
import type { AdminUser } from '../services/api';

interface LayoutMapProps {
  plots: Plot[];
  onSelectPlot: (plot: Plot) => void;
  onHoverPlot: (plot: Plot | null) => void;
  hoveredPlot: Plot | null;
  adminUser: AdminUser | null;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
}

const LayoutMap: React.FC<LayoutMapProps> = ({
  plots,
  onSelectPlot,
  onHoverPlot,
  hoveredPlot,
  adminUser,
  onOpenAdminModal,
  onLogoutAdmin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [filterSurvey, setFilterSurvey] = useState<'all' | '98' | '101'>('all');
  const [filterStatus, setFilterStatus] = useState<PlotStatus | 'all'>('all');
  const [imgLoaded, setImgLoaded] = useState(false);
  const [searchPlot, setSearchPlot] = useState('');

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
    all: plots.length,
    available: plots.filter((p) => p.status === 'available').length,
    booked: plots.filter((p) => p.status === 'booked').length,
    sold: plots.filter((p) => p.status === 'sold').length,
  }), [plots]);

  const filteredPlots = useMemo(() => {
    let result = plots;
    if (filterSurvey !== 'all') result = result.filter((p) => p.surveyNo === filterSurvey);
    if (filterStatus !== 'all') result = result.filter((p) => p.status === filterStatus);
    if (searchPlot.trim()) {
      const n = parseInt(searchPlot.trim());
      if (!isNaN(n)) result = result.filter((p) => p.number === n);
    }
    return result;
  }, [plots, filterSurvey, filterStatus, searchPlot]);

  return (
    <section id="layout" className="py-4 sm:py-8 bg-gray-950">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-white/10 gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-gray-950 font-black text-[11px] sm:text-sm">SM</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-xs sm:text-base leading-tight truncate">
                Shreemant Jagadevrao Deshmukh Layout
              </h1>
              <span className="text-amber-400 text-[10px] sm:text-xs font-semibold">
                Survey No. 98 &amp; 101 · Nalatavad
              </span>
            </div>
          </div>

          {/* Admin button / badge */}
          <div className="flex-shrink-0">
            {adminUser ? (
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2 sm:px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-semibold text-amber-300 whitespace-nowrap">
                    {adminUser.username}
                  </span>
                </div>
                <button
                  onClick={onLogoutAdmin}
                  className="text-[10px] text-gray-400 hover:text-red-400 font-bold underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                className="flex items-center gap-1 sm:gap-1.5 bg-white/10 hover:bg-white/20 text-amber-400 font-bold text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-2 rounded-xl border border-amber-500/30 transition-all shadow-sm whitespace-nowrap"
              >
                🔑 <span className="hidden sm:inline">Admin</span> Login
              </button>
            )}
          </div>
        </div>

        {/* ── Title ── */}
        <div className="text-center mb-4 sm:mb-6 px-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-1 leading-tight">
            Master Plan &amp; Plot Status Tracker
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-[11px] sm:text-sm">
            Tap any plot to view details, 3D model, and dimensions.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {[
            { label: 'Total Plots', value: counts.all, color: 'text-white' },
            { label: 'Available', value: counts.available, color: 'text-green-400' },
            { label: 'Booked', value: counts.booked, color: 'text-orange-400' },
            { label: 'Sold', value: counts.sold, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-center">
              <div className={`text-lg sm:text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-[9px] sm:text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter + Search bar ── */}
        <div className="flex flex-col gap-2.5 mb-4 sm:mb-5 bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3">
          {/* Row 1: Survey + Status filters */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Survey filter */}
            <div className="flex gap-1 flex-shrink-0">
              {(['all', '98', '101'] as const).map((val) => (
                <button
                  key={val}
                  onClick={() => setFilterSurvey(val)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                    filterSurvey === val
                      ? 'bg-amber-500 text-gray-900 font-bold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {val === 'all' ? 'All' : `SY ${val}`}
                </button>
              ))}
            </div>

            <div className="w-px h-4 bg-white/10 flex-shrink-0" />

            {/* Status filter */}
            <div className="flex flex-wrap gap-1">
              {([
                ['all', 'All'],
                ['available', '🟢 Available'],
                ['booked', '🟠 Booked'],
                ['sold', '🔴 Sold'],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilterStatus(val as any)}
                  className={`px-2 sm:px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                    filterStatus === val
                      ? 'bg-white/20 text-white ring-1 ring-white/30 font-bold'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Search + Download + Count */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 max-w-[140px]">
              <input
                type="number"
                placeholder="Plot #"
                value={searchPlot}
                onChange={(e) => setSearchPlot(e.target.value)}
                className="bg-white/5 border border-white/10 text-white text-xs rounded-lg pl-7 pr-2 py-2 w-full focus:outline-none focus:border-amber-500/50 placeholder-gray-600"
              />
              <svg className="w-3 h-3 text-gray-500 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Download */}
            <a
              href="/layout_original.pdf"
              download="Shreemant_Jagadevrao_Deshmukh_Layout_Master_Plan.pdf"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-900 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-2 rounded-lg transition-all shadow-md whitespace-nowrap active:scale-[0.97]"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download </span>PDF
            </a>

            <span className="text-gray-500 text-[10px] sm:text-xs whitespace-nowrap ml-auto">
              {filteredPlots.length} plots
            </span>
          </div>
        </div>

        {/* ── Mobile Swipe Hint ── */}
        <div className="block lg:hidden text-center text-amber-500/70 text-[9px] uppercase font-bold tracking-widest mb-2 animate-pulse">
          ← Swipe to pan the layout map →
        </div>

        {/* ── Map container ── */}
        <div className="overflow-x-auto overflow-y-hidden max-w-full rounded-2xl border border-white/10 shadow-2xl bg-gray-900">
          <div
            ref={containerRef}
            className="relative min-w-[950px] lg:min-w-0 w-full"
            style={{ aspectRatio: '1191/842' }}
          >
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

            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            )}

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

          {/* Legend bar */}
          <div className="bg-gray-900/90 backdrop-blur border-t border-white/10 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between text-[9px] sm:text-[11px] text-gray-400 min-w-[950px] lg:min-w-0 flex-wrap gap-1">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>Available ({counts.available})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Booked ({counts.booked})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>Sold ({counts.sold})</span>
              </div>
            </div>
            <span className="hidden sm:inline">Shreemant Jagadevrao Deshmukh Layout · Nalatavad</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayoutMap;
