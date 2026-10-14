import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogIn, UserPlus, LogOut, Radio } from "lucide-react";

export default function Navbar({ title, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div>
        <p className="breadcrumb">{breadcrumb || "Campus Management / Portal"}</p>
        <h1>{title || "Smart Campus Bus Management"}</h1>
      </div>

      <div className="topbar-right">
        <div className="connection-pill" title="Backend API connection status">
          <span className="live-pulse"></span>
          <span>Cloud API Active</span>
        </div>

        {user ? (
          <div className="admin-chip">
            <div className="admin-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role} • {user.department || "Campus"}</span>
            </div>
            <button 
              className="topbar-action-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="topbar-auth-buttons">
            <Link to="/login" className="btn-secondary-sm">
              <LogIn size={15} /> Sign In
            </Link>
            <Link to="/register" className="btn-primary-sm">
              <UserPlus size={15} /> Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
