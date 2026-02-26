import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import AppGuideBot from './components/AppGuideBot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/profile" element={<Profile />} />

                {/* Embed bot inside ProtectedRoute so it only shows when logged in, but we have to handle it differently since it isn't a page */}
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            <AppGuideBot />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
