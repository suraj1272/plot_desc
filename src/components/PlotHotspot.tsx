import React from 'react';
import type { Plot } from '../types';
import type { PlotStatus } from '../types';

interface PlotHotspotProps {
  plot: Plot;
  containerWidth: number;
  containerHeight: number;
  onSelect: (plot: Plot) => void;
  onHover: (plot: Plot | null) => void;
  isHovered: boolean;
}

const statusConfig: Record<PlotStatus, { fill: string; hoverFill: string; label: string; dot: string }> = {
  available: {
    fill: 'rgba(74, 222, 128, 0.25)',
    hoverFill: 'rgba(74, 222, 128, 0.55)',
    label: 'Available',
    dot: 'bg-green-400',
  },
  booked: {
    fill: 'rgba(251, 146, 60, 0.30)',
    hoverFill: 'rgba(251, 146, 60, 0.58)',
    label: 'Booked',
    dot: 'bg-orange-400',
  },
  sold: {
    fill: 'rgba(248, 113, 113, 0.30)',
    hoverFill: 'rgba(248, 113, 113, 0.55)',
    label: 'Sold',
    dot: 'bg-red-400',
  },
};

const PlotHotspot: React.FC<PlotHotspotProps> = ({
  plot,
  containerWidth,
  containerHeight,
  onSelect,
  onHover,
  isHovered,
}) => {
  const { hotspot, status, number, dimensions } = plot;
  const config = statusConfig[status];

  // Compute pixel positions
  const left = (hotspot.x / 100) * containerWidth;
  const top = (hotspot.y / 100) * containerHeight;
  const width = (hotspot.width / 100) * containerWidth;
  const height = (hotspot.height / 100) * containerHeight;

  const formatPrice = (price?: number) =>
    price ? `₹${(price / 100000).toFixed(1)}L` : 'On Request';

  return (
    <div
      className="absolute cursor-pointer select-none group"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: hotspot.rotation ? `rotate(${hotspot.rotation}deg)` : undefined,
        transformOrigin: 'top left',
      }}
      onClick={() => onSelect(plot)}
      onMouseEnter={() => onHover(plot)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Fill overlay (Pill shape) */}
      <div
        className={`absolute inset-0 border rounded-full transition-all duration-200 shadow-md ${
          isHovered ? 'scale-110 shadow-lg z-20' : ''
        }`}
        style={{
          backgroundColor: isHovered ? 'rgba(34, 197, 94, 0.75)' : 'rgba(34, 197, 94, 0.4)',
          borderColor: isHovered ? '#22c55e' : 'rgba(34, 197, 94, 0.6)',
          boxShadow: isHovered ? '0 0 10px rgba(34, 197, 94, 0.6)' : 'none',
        }}
      />

      {/* Plot number label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="font-black text-white text-[8px] sm:text-[9px] tracking-tighter"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)', lineHeight: 1 }}
        >
          {number}
        </span>
      </div>

      {/* Tooltip — shown on hover */}
      {isHovered && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            bottom: '105%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <div className="bg-gray-900/95 backdrop-blur text-white rounded-xl px-3 py-2.5 shadow-2xl border border-white/10 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <span>Plot {number}</span>
              {plot.block && (
                <span className="text-amber-400 font-mono text-xs">Block {plot.block}</span>
              )}
              {plot.corner && (
                <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                  CORNER
                </span>
              )}
            </div>
            <div className="flex gap-3 text-gray-300">
              <span>{dimensions.length}×{dimensions.width} ft</span>
              <span>·</span>
              <span>{dimensions.area} sq ft</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${config.dot} inline-block`}
                />
                <span
                  className={
                    status === 'available'
                      ? 'text-green-400'
                      : status === 'booked'
                      ? 'text-orange-400'
                      : 'text-red-400'
                  }
                >
                  {config.label}
                </span>
              </div>
              {plot.totalPrice && (
                <span className="text-amber-400 font-semibold">
                  {formatPrice(plot.totalPrice)}
                </span>
              )}
            </div>
            <div className="text-gray-500 text-[10px] text-center pt-0.5">Click to view details</div>
          </div>
          {/* Arrow */}
          <div
            className="w-3 h-3 bg-gray-900 border-r border-b border-white/10 absolute left-1/2 -translate-x-1/2 rotate-45"
            style={{ bottom: '-6px' }}
          />
        </div>
      )}
    </div>
  );
};

export default PlotHotspot;
