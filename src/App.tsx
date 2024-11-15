import  { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from './atoms/authAtom';
import { ProtectedRoute } from './utils/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { AppShell } from './components/layout/AppShell';
import { CarList } from './components/cars/CarList';
import { CarForm } from './components/cars/CarForm';
import { CarDetail } from './components/cars/CarDetail';
import { Toaster } from "./components/ui/toaster"
import { getCurrentUser } from './api/api';
import { setupApiInterceptors } from './api/api';

function AppContent() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    setupApiInterceptors(logout);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        logout();
      }
    };

    if (!user && localStorage.getItem('accessToken')) {
      fetchUser();
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <CarList />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/new"
        element={
          <ProtectedRoute>
            <AppShell>
              <CarForm />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <CarDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/:id/edit"
        element={
          <ProtectedRoute>
            <AppShell>
              <CarForm isEditing />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppShell>
              <CarList />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster />
    </Router>
  );
}

export default App;