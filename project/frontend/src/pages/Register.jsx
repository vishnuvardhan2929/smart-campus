import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Bus, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [department, setDepartment] = useState("Computer Science");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid campus email address.");
      return;
    }
    if (!password || password.length < 5) {
      setError("Password should be at least 5 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register({
        name,
        email,
        role,
        department,
        phone,
      });
      setLoading(false);
      navigate("/dashboard");
    }, 400);
  }

  return (
    <div className="auth-viewport">
      <div className="auth-card register-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Bus size={28} color="#ffffff" />
          </div>
          <h2>Join CampusRide</h2>
          <p>Register for bus transit, pass issuance, and schedule notifications</p>
        </div>

        {error && (
          <div className="auth-alert">
            <span>{error}</span>
          </div>
        )}

        <div className="role-selector">
          {["Student", "Driver", "Admin"].map((r) => (
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
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={18} className="field-icon" />
              <input
                type="text"
                placeholder="e.g. Vishnu Vardhan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Campus Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                placeholder="e.g. vishnu@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>{role === "Student" ? "Department" : role === "Driver" ? "License Category" : "Admin Division"}</label>
              <div className="input-with-icon">
                <Building2 size={18} className="field-icon" />
                <input
                  type="text"
                  placeholder={role === "Student" ? "Computer Science" : role === "Driver" ? "Commercial Heavy" : "Transport Operations"}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Contact Phone</label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Min 5 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="field-icon" />
                <input
                  type="password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? "Registering account..." : `Create ${role} Account`} <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-footer-prompt">
          <span>Already registered with campus transit?</span>
          <Link to="/login" className="auth-highlight-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

