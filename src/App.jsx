import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Academic from "./pages/Academic Hub/AcademicHub";
import Marketplace from "./pages/Marketplace/Marketplace";
import Reporter from "./pages/Reporter/Reporter";
import Events from "./pages/Events/Events";
import Profile from "./pages/Profile/Profile";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { useAuth } from "./context/useAuth";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import "./App.css";

function Layout() {
  const { logout } = useAuth();
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-section">
        <Navbar onLogout={logout} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/home/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="academic" element={<Academic />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="reporter" element={<Reporter />} />
        <Route path="events" element={<Events />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/home/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
