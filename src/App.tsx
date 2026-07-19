import './index.css';
import LayoutMap from './components/LayoutMap';
import PlotDetailModal from './components/PlotDetailModal';
import { usePlotSelection } from './hooks/usePlotSelection';

function App() {
  const { selectedPlot, hoveredPlot, isModalOpen, selectPlot, closeModal, hoverPlot } =
    usePlotSelection();

  return (
    <div className="min-h-screen bg-gray-950 py-10">
      <LayoutMap
        onSelectPlot={selectPlot}
        onHoverPlot={hoverPlot}
        hoveredPlot={hoveredPlot}
      />

      {/* Plot Detail Modal */}
      <PlotDetailModal
        plot={selectedPlot}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
