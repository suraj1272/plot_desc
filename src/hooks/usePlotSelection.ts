import { useState, useCallback } from 'react';
import type { Plot } from '../types';

export function usePlotSelection() {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [hoveredPlot, setHoveredPlot] = useState<Plot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectPlot = useCallback((plot: Plot) => {
    setSelectedPlot(plot);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Keep selectedPlot briefly so exit animation can complete
    setTimeout(() => setSelectedPlot(null), 300);
  }, []);

  const hoverPlot = useCallback((plot: Plot | null) => {
    setHoveredPlot(plot);
  }, []);

  return {
    selectedPlot,
    hoveredPlot,
    isModalOpen,
    selectPlot,
    closeModal,
    hoverPlot,
  };
}
