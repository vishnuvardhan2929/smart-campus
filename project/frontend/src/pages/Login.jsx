import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Bus, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles,
  UserCheck,
  GraduationCap
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your campus email or username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(email, password, role);
      setLoading(false);
      navigate("/dashboard");
    }, 400);
  }

  function handleDemoLogin(demoRole, demoEmail) {
    setLoading(true);
    setTimeout(() => {
      login(demoEmail, "demo123", demoRole);
      setLoading(false);
      navigate("/dashboard");
    }, 300);
  }

  return (
    <div className="auth-viewport">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Bus size={28} color="#ffffff" />
          </div>
          <h2>CampusRide Portal</h2>
          <p>Smart Campus Bus Management & Transport Logistics</p>
        </div>

        {error && (
          <div className="auth-alert">
            <span>{error}</span>
          </div>
        )}

        {/* Role Tabs */}
        <div className="role-selector">
          {["Admin", "Student", "Driver"].map((r) => (
            <button
              key={r}
              type="button"
              className={`role-tab ${role === r ? "active" : ""}`}
              onClick={() => setRole(r)}
            >
              {r === "Admin" && <ShieldCheck size={15} />}
              {r === "Student" && <GraduationCap size={15} />}
              {r === "Driver" && <UserCheck size={15} />}
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Campus Email / ID</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder={role === "Admin" ? "admin@campus.edu" : role === "Student" ? "student.roll@campus.edu" : "driver@campus.edu"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-group-label-row">
              <label>Password</label>
              <span className="forgot-link">Forgot password?</span>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your security password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Authenticating..." : `Sign In as ${role}`} <ArrowRight size={17} />
          </button>
        </form>

        {/* Instant Demo Accounts */}
        <div className="demo-accounts-box">
          <div className="demo-header">
            <Sparkles size={14} /> One-Click Instant Sign In
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn admin"
              onClick={() => handleDemoLogin("Admin", "admin@campus.edu")}
            >
              Admin Demo
            </button>
            <button
              type="button"
              className="demo-btn student"
              onClick={() => handleDemoLogin("Student", "rahul.cs24@campus.edu")}
            >
              Student Demo
            </button>
            <button
              type="button"
              className="demo-btn driver"
              onClick={() => handleDemoLogin("Driver", "ramesh.driver@campus.edu")}
            >
              Driver Demo
            </button>
          </div>
        </div>

        <div className="auth-footer-prompt">
          <span>New to Campus Transit?</span>
          <Link to="/register" className="auth-highlight-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

