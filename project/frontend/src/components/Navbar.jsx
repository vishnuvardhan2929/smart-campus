import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiBase, setApiBase, testApiConnection } from "../api/client";
import { LogIn, UserPlus, LogOut, CheckCircle2, AlertCircle, Link as LinkIcon, X, Server } from "lucide-react";

export default function Navbar({ title, breadcrumb }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfig, setShowConfig] = useState(false);
  const [apiInput, setApiInput] = useState("");
  const [status, setStatus] = useState("checking");
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const currentApi = getApiBase();

  useEffect(() => {
    let mounted = true;
    testApiConnection().then((res) => {
      if (mounted) {
        setStatus(res.success ? "connected" : "disconnected");
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleOpenConfig = () => {
    setApiInput(localStorage.getItem("campus_api_url") || "");
    setTestResult(null);
    setShowConfig(true);
  };

  const handleSaveAndConnect = async (e) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);
    const test = await testApiConnection(apiInput);
    setTesting(false);
    if (test.success) {
      setApiBase(apiInput);
      setTestResult({ success: true, message: "Connected successfully! Reloading..." });
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } else {
      // Still allow saving if user wants
      setApiBase(apiInput);
      setTestResult({ 
        success: false, 
        message: "Saved, but endpoint did not respond. Check that your Railway domain is active and public." 
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleReset = () => {
    setApiBase(null);
    window.location.reload();
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="breadcrumb">{breadcrumb || "Campus Management / Portal"}</p>
          <h1>{title || "Smart Campus Bus Management"}</h1>
        </div>

        <div className="topbar-right">
          <button 
            type="button" 
            className={`connection-pill ${status}`} 
            onClick={handleOpenConfig}
            title={`API Endpoint: ${currentApi}. Click to configure Railway URL.`}
          >
            <span className={`live-pulse ${status}`}></span>
            <span>{status === "connected" ? "Backend Connected" : "Backend Disconnected"}</span>
          </button>

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

      {/* Backend API Configuration Modal */}
      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal-sheet config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <div className="bus-badge modal">
                  <Server size={22} />
                  <span>Railway API Configuration</span>
                </div>
                <div>
                  <h2>Connect Backend to Railway</h2>
                  <p>Configure the live Spring Boot API URL running on Railway</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowConfig(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAndConnect}>
              <div className="modal-body">
                <div className="config-current-box">
                  <small>CURRENT ACTIVE ENDPOINT</small>
                  <code>{currentApi}</code>
                  <span className={`status-badge-text ${status}`}>
                    {status === "connected" ? "● Connected & Responding" : "○ Unreachable (Check Railway URL)"}
                  </span>
                </div>

                <div className="form-group" style={{ marginTop: "16px" }}>
                  <label htmlFor="railwayUrlInput">
                    <strong>Enter Railway Backend Public URL</strong>
                  </label>
                  <p className="field-hint">
                    Copy the public domain from your Railway project (e.g. <code>https://smart-campus-production.up.railway.app</code>).
                  </p>
                  <div className="input-with-icon">
                    <LinkIcon size={18} className="field-icon" />
                    <input
                      id="railwayUrlInput"
                      type="url"
                      placeholder="https://your-backend.up.railway.app"
                      value={apiInput}
                      onChange={(e) => setApiInput(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {testResult && (
                  <div className={`alert-banner ${testResult.success ? "success" : "warning"}`} style={{ marginTop: "14px" }}>
                    {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  Reset to Default
                </button>
                <button type="submit" className="btn-primary" disabled={testing}>
                  {testing ? "Testing connection..." : "Connect to Railway"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
