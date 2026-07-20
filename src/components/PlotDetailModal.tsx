import React, { useEffect, Suspense, lazy } from 'react';
import type { Plot, PlotStatus } from '../types';

// Lazy-load the heavy 3D viewer
const Plot3DViewer = lazy(() => import('./Plot3DViewer'));

interface PlotDetailModalProps {
  plot: Plot | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn?: boolean;
  onUpdatePlotStatus?: (surveyNo: string, number: number, status: PlotStatus) => Promise<void>;
}

const statusConfig: Record<PlotStatus, { label: string; className: string; bg: string }> = {
  available: {
    label: 'Available',
    className: 'text-green-400 border-green-400/30 bg-green-400/10',
    bg: 'bg-green-400',
  },
  booked: {
    label: 'Booked',
    className: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    bg: 'bg-orange-400',
  },
  sold: {
    label: 'Sold',
    className: 'text-red-400 border-red-400/30 bg-red-400/10',
    bg: 'bg-red-400',
  },
};

const facingColors: Record<string, string> = {
  North: 'text-blue-400',
  South: 'text-orange-400',
  East: 'text-amber-400',
  West: 'text-purple-400',
  'North-East': 'text-emerald-400',
  'North-West': 'text-cyan-400',
  'South-East': 'text-yellow-400',
  'South-West': 'text-pink-400',
};

const CompassIcon = ({ facing }: { facing: string }) => {
  const directionAngles: Record<string, number> = {
    North: 0,
    'North-East': 45,
    East: 90,
    'South-East': 135,
    South: 180,
    'South-West': 225,
    West: 270,
    'North-West': 315,
  };
  const angle = directionAngles[facing] ?? 0;

  return (
    <div className="relative w-12 h-12 flex-shrink-0">
      <div className="absolute inset-0 rounded-full border border-white/20 bg-white/5" />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-2 h-4 bg-amber-400 rounded-sm" />
          <div className="w-2 h-4 bg-gray-600 rounded-sm" />
        </div>
      </div>
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] text-amber-400 font-bold">N</div>
    </div>
  );
};

const PlotDetailModal: React.FC<PlotDetailModalProps> = ({
  plot,
  isOpen,
  onClose,
  isAdminLoggedIn,
  onUpdatePlotStatus,
}) => {
  const [updating, setUpdating] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!plot) return null;

  const status = statusConfig[plot.status];
  const { dimensions, facing, number, corner, features } = plot;

  const handleStatusChange = async (newStatus: PlotStatus) => {
    if (!plot.surveyNo || !onUpdatePlotStatus || updating || plot.status === newStatus) return;
    setUpdating(true);
    setUpdateError(null);
    try {
      await onUpdatePlotStatus(plot.surveyNo, plot.number, newStatus);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out
          bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl
          lg:top-0 lg:bottom-0 lg:right-0 lg:left-auto lg:w-[600px] lg:h-full lg:rounded-none lg:rounded-l-3xl
          bg-gray-950 border-t lg:border-t-0 lg:border-l border-white/10 shadow-2xl flex flex-col
          ${isOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-y-0 lg:translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {plot.surveyNo && (
                <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-amber-500/20">
                  SY {plot.surveyNo}
                </span>
              )}
              {corner && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-500/30">
                  Corner Plot
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                Plot {number}
              </h2>
            </div>
            {plot.layoutName && (
              <p className="text-gray-500 text-[11px] mt-0.5 leading-none">{plot.layoutName}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-semibold ${status.className}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.bg}`} />
                {status.label}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Admin Plot Status Control Bar */}
          {isAdminLoggedIn && (
            <div className="mx-4 mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Admin Controls: Update Plot Status
                </span>
                {updating && (
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                )}
              </div>

              {updateError && (
                <div className="mb-2 text-red-400 text-xs bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                  {updateError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {(['available', 'booked', 'sold'] as PlotStatus[]).map((st) => {
                  const isCurrent = plot.status === st;
                  const colors = {
                    available: 'border-green-500 text-green-400 bg-green-500/20 hover:bg-green-500/30',
                    booked: 'border-orange-500 text-orange-400 bg-orange-500/20 hover:bg-orange-500/30',
                    sold: 'border-red-500 text-red-400 bg-red-500/20 hover:bg-red-500/30',
                  }[st];

                  return (
                    <button
                      key={st}
                      disabled={updating}
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                        isCurrent
                          ? `${colors} ring-2 ring-amber-400 shadow-lg`
                          : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {st === 'available' ? '🟢 Available' : st === 'booked' ? '🟠 Booked' : '🔴 Sold'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3D Viewer */}
          <div className="h-56 lg:h-64 mx-4 mt-4 rounded-2xl overflow-hidden border border-white/10 bg-gray-800">
            <Suspense
              fallback={
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm">Loading 3D view...</p>
                </div>
              }
            >
              <Plot3DViewer plot={plot} />
            </Suspense>
          </div>

          {/* 3D controls hint */}
          <p className="text-center text-gray-500 text-[11px] mt-2 mb-4">
            🖱️ Drag to rotate · Scroll to zoom · Right-click to pan
          </p>

          <div className="px-5 pb-8 space-y-5">
            {/* Dimension stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Dimensions',
                  value: `${dimensions.length} × ${dimensions.width}`,
                  sub: 'feet',
                  icon: '📐',
                },
                {
                  label: 'Area',
                  value: dimensions.area.toLocaleString(),
                  sub: 'sq ft',
                  icon: '📏',
                },
                {
                  label: 'Area (Metric)',
                  value: (dimensions.areaMetric ?? Math.round(dimensions.area * 0.0929)).toFixed(1),
                  sub: 'sq m',
                  icon: '🔢',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
                >
                  <div className="text-xl mb-1">{stat.icon}</div>
                  <div className="text-white font-bold text-base leading-tight">{stat.value}</div>
                  <div className="text-gray-400 text-[10px]">{stat.sub}</div>
                  <div className="text-gray-500 text-[10px] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Details row */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm mb-2">Plot Details</h3>

              {[
                {
                  label: 'Layout Name',
                  value: <span className="text-amber-400 font-semibold text-xs text-right">{plot.layoutName || 'Shreemant Jagadevrao Deshmukh Layout'}</span>,
                },
                {
                  label: 'Survey Number',
                  value: <span className="text-white font-mono font-bold">SY No. {plot.surveyNo || 'N/A'}</span>,
                },
                {
                  label: 'Facing Direction',
                  value: (
                    <div className="flex items-center gap-2">
                      <CompassIcon facing={facing} />
                      <span className={`font-bold ${facingColors[facing] ?? 'text-white'}`}>
                        {facing}
                      </span>
                    </div>
                  ),
                },
                {
                  label: 'Plot Number',
                  value: <span className="text-amber-400 font-mono font-bold">#{number.toString().padStart(3, '0')}</span>,
                },
                {
                  label: 'Plot Type',
                  value: <span className="text-white">{dimensions.dimensionLabel ?? (dimensions.area > 1500 ? 'Premium' : 'Standard')}</span>,
                },
                {
                  label: 'Corner Plot',
                  value: corner ? (
                    <span className="text-green-400 font-semibold">Yes</span>
                  ) : (
                    <span className="text-gray-500">No</span>
                  ),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{row.label}</span>
                  <div className="text-sm">{row.value}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div>
                <h3 className="text-white font-semibold text-sm mb-3">Plot Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full"
                    >
                      <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3 pt-2">
              {plot.status === 'available' ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href="tel:+919448210248"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call 9448210248
                  </a>
                  <a
                    href={`https://wa.me/919448210248?text=Hello%2C%20I%20am%20interested%20in%20Plot%20%23${number}%20(Survey%20No.%20${plot.surveyNo})%20in%20Shreemant%20Jagadevrao%20Deshmukh%20Layout.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 text-sm"
                  >
                    <span>💬 WhatsApp Enquiry</span>
                  </a>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full bg-white/5 text-gray-500 font-semibold py-3.5 rounded-xl border border-white/10 cursor-not-allowed"
                >
                  {plot.status === 'booked' ? 'This plot is Booked' : 'This plot is Sold'}
                </button>
              )}
            </div>

            {/* Back button */}
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 text-sm py-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Layout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlotDetailModal;
