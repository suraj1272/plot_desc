import { useState, useEffect } from 'react';
import './index.css';
import LayoutMap from './components/LayoutMap';
import PlotDetailModal from './components/PlotDetailModal';
import AdminLoginModal from './components/AdminLoginModal';
import { usePlotSelection } from './hooks/usePlotSelection';
import type { Plot, PlotStatus } from './types';
import { 
  fetchPlots, 
  updatePlotStatusApi, 
  verifyAdminTokenApi, 
  type AdminUser 
} from './services/api';

function App() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const { selectedPlot, hoveredPlot, isModalOpen, selectPlot, closeModal, hoverPlot } =
    usePlotSelection();

  // Load initial plot data
  useEffect(() => {
    async function loadPlots() {
      setLoading(true);
      const data = await fetchPlots();
      setPlots(data);
      setLoading(false);
    }
    loadPlots();
  }, []);

  // Check saved admin session on startup
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');

    if (savedToken && savedUser) {
      setAdminToken(savedToken);
      setAdminUser(JSON.parse(savedUser));

      // Verify token in background
      verifyAdminTokenApi(savedToken)
        .then((user) => {
          setAdminUser(user);
        })
        .catch(() => {
          // Token expired
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setAdminUser(null);
          setAdminToken(null);
        });
    }
  }, []);

  const handleLoginSuccess = (user: AdminUser, token: string) => {
    setAdminUser(user);
    setAdminToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setAdminToken(null);
  };

  const handleUpdatePlotStatus = async (surveyNo: string, number: number, newStatus: PlotStatus) => {
    if (!adminToken) {
      setIsAdminModalOpen(true);
      throw new Error('Please log in as Admin to update plot status');
    }

    // Call backend API
    const updatedPlot = await updatePlotStatusApi(surveyNo, number, newStatus, adminToken);

    // Update local state instantly
    setPlots((prevPlots) =>
      prevPlots.map((p) =>
        p.surveyNo === surveyNo && p.number === number
          ? { ...p, status: updatedPlot.status }
          : p
      )
    );

    // Update currently selected plot if open
    if (selectedPlot && selectedPlot.surveyNo === surveyNo && selectedPlot.number === number) {
      selectPlot({ ...selectedPlot, status: updatedPlot.status });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-4 sm:py-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading master plan layout...</p>
        </div>
      ) : (
        <LayoutMap
          plots={plots}
          onSelectPlot={selectPlot}
          onHoverPlot={hoverPlot}
          hoveredPlot={hoveredPlot}
          adminUser={adminUser}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onLogoutAdmin={handleLogout}
        />
      )}

      {/* Plot Detail Modal */}
      <PlotDetailModal
        plot={selectedPlot}
        isOpen={isModalOpen}
        onClose={closeModal}
        isAdminLoggedIn={!!adminUser}
        onUpdatePlotStatus={handleUpdatePlotStatus}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
