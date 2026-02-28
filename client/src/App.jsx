import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import AppGuideBot from './components/AppGuideBot';

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <AppGuideBot />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
          <Routes>
            {/* Public Root Route (No Navbar) */}
            <Route path="/" element={<Landing />} />

            {/* Application Routes Wrap with Navbar */}
            <Route element={<AppLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Redirects within App Layout */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
