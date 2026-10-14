import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import BusDetails from "./pages/BusDetails";
import Management from "./pages/Management";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

// Layout wrapper for authenticated/dashboard pages with persistent sidebar
function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main Application Pages */}
          <Route 
            path="/dashboard" 
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } 
          />
          <Route 
            path="/bus-details" 
            element={
              <AppLayout>
                <BusDetails />
              </AppLayout>
            } 
          />
          <Route 
            path="/management" 
            element={
              <AppLayout>
                <Management />
              </AppLayout>
            } 
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}