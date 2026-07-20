import { useState, useEffect, useCallback } from 'react';
import './index.css';
import LayoutMap from './components/LayoutMap';
import PlotDetailModal from './components/PlotDetailModal';
import AdminLoginModal from './components/AdminLoginModal';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { usePlotSelection } from './hooks/usePlotSelection';
import type { Plot, PlotStatus } from './types';
import localPlotsData from './data/plots.json';
import { 
  fetchPlots, 
  updatePlotStatusApi, 
  verifyAdminTokenApi, 
  type AdminUser 
} from './services/api';

function App() {
  // Instant initial load using local plots JSON
  const [plots, setPlots] = useState<Plot[]>(localPlotsData as unknown as Plot[]);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const { selectedPlot, hoveredPlot, isModalOpen, selectPlot, closeModal, hoverPlot } =
    usePlotSelection();

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Asynchronously sync plots from MongoDB API in background
  useEffect(() => {
    let isMounted = true;
    async function loadPlots() {
      const data = await fetchPlots();
      if (isMounted && data && data.length > 0) {
        setPlots(data);
      }
    }
    loadPlots();
    return () => { isMounted = false; };
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
    addToast(
      'success',
      'Logged In Successfully! 👋',
      `Welcome back, ${user.name || user.username}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setAdminToken(null);
    addToast('info', 'Logged Out Successfully', 'You have been signed out of the Admin panel.');
  };

  const handleUpdatePlotStatus = async (surveyNo: string, number: number, newStatus: PlotStatus) => {
    if (!adminToken) {
      setIsAdminModalOpen(true);
      addToast('error', 'Authentication Required', 'Please log in as Admin to update plot status.');
      throw new Error('Please log in as Admin to update plot status');
    }

    try {
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

      addToast(
        'success',
        'Plot Status Updated! 🎉',
        `Plot #${number} in Survey ${surveyNo} set to '${newStatus.toUpperCase()}'.`
      );
    } catch (err: any) {
      addToast('error', 'Status Update Failed', err.message || 'Could not update plot status.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-4 sm:py-6">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <LayoutMap
        plots={plots}
        onSelectPlot={selectPlot}
        onHoverPlot={hoverPlot}
        hoveredPlot={hoveredPlot}
        adminUser={adminUser}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={handleLogout}
      />

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
