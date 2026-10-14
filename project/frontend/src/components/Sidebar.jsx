import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Bus, 
  MapPin, 
  UserCheck, 
  GraduationCap, 
  CalendarClock, 
  SlidersHorizontal,
  LogOut, 
  LogIn, 
  UserPlus, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
        <div className="brand-icon">
          <Bus size={24} color="#ffffff" />
        </div>
        <div>
          <h2>CampusRide</h2>
          <span>TRANSPORT SYSTEM</span>
        </div>
      </div>

      <p className="menu-label">OVERVIEW</p>
      <nav>
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><LayoutDashboard size={18} /></span>
          Dashboard
          <span className="nav-arrow"><ChevronRight size={16} /></span>
        </NavLink>

        <NavLink 
          to="/bus-details" 
          className={({ isActive }) => `nav-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><Bus size={18} /></span>
          Bus Details & Fleet
          <span className="nav-arrow"><ChevronRight size={16} /></span>
        </NavLink>

        <NavLink 
          to="/management" 
          className={({ isActive }) => `nav-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><SlidersHorizontal size={18} /></span>
          Record Management
          <span className="nav-arrow"><ChevronRight size={16} /></span>
        </NavLink>
      </nav>

      <p className="menu-label" style={{ marginTop: "24px" }}>QUICK MODULES</p>
      <nav>
        <NavLink 
          to="/management?tab=Buses" 
          className={({ isActive }) => `nav-item sub-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><Bus size={16} /></span>
          Buses
        </NavLink>
        <NavLink 
          to="/management?tab=Routes" 
          className={({ isActive }) => `nav-item sub-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><MapPin size={16} /></span>
          Routes
        </NavLink>
        <NavLink 
          to="/management?tab=Drivers" 
          className={({ isActive }) => `nav-item sub-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><UserCheck size={16} /></span>
          Drivers
        </NavLink>
        <NavLink 
          to="/management?tab=Students" 
          className={({ isActive }) => `nav-item sub-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><GraduationCap size={16} /></span>
          Students
        </NavLink>
        <NavLink 
          to="/management?tab=Schedules" 
          className={({ isActive }) => `nav-item sub-item ${isActive ? "selected" : ""}`}
        >
          <span className="nav-icon"><CalendarClock size={16} /></span>
          Schedules
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <strong>{user.name}</strong>
              <span className="user-role-badge">{user.role}</span>
            </div>
            <button 
              className="sidebar-logout-btn" 
              onClick={handleLogout} 
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="sidebar-auth-links">
            <NavLink to="/login" className="sidebar-auth-btn login">
              <LogIn size={15} /> Sign In
            </NavLink>
            <NavLink to="/register" className="sidebar-auth-btn register">
              <UserPlus size={15} /> Register
            </NavLink>
          </div>
        )}

        <div className="sidebar-system-status">
          <div className="status-dot"></div>
          <div>
            <strong>Campus Cloud Portal</strong>
            <span>Active v2.0 • Live</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
