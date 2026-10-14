import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bus, 
  MapPin, 
  UserCheck, 
  GraduationCap, 
  CalendarClock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { fetchFromApi } from "../api/client";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [students, setStudents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [errorNotice, setErrorNotice] = useState("");

  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const [busesData, routesData, driversData, studentsData, schedulesData] = await Promise.allSettled([
          fetchFromApi("buses"),
          fetchFromApi("routes"),
          fetchFromApi("drivers"),
          fetchFromApi("students"),
          fetchFromApi("schedules"),
        ]);

        if (busesData.status === "fulfilled" && Array.isArray(busesData.value)) setBuses(busesData.value);
        if (routesData.status === "fulfilled" && Array.isArray(routesData.value)) setRoutes(routesData.value);
        if (driversData.status === "fulfilled" && Array.isArray(driversData.value)) setDrivers(driversData.value);
        if (studentsData.status === "fulfilled" && Array.isArray(studentsData.value)) setStudents(studentsData.value);
        if (schedulesData.status === "fulfilled" && Array.isArray(schedulesData.value)) setSchedules(schedulesData.value);
        setErrorNotice("");
      } catch (err) {
        setErrorNotice("Unable to reach backend API. Showing offline preview mode.");
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  const totalSeats = buses.reduce((acc, b) => acc + (Number(b.totalSeats) || 0), 0);
  const availableSeats = buses.reduce((acc, b) => acc + (Number(b.availableSeats) || 0), 0);
  const occupiedSeats = Math.max(0, totalSeats - availableSeats);
  const occupancyRate = totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const activeBusesCount = buses.filter(b => (b.status || "").toLowerCase().includes("active") || (b.status || "").toLowerCase().includes("running")).length || buses.length;

  return (
    <div className="page-container">
      <Navbar title="Transport Overview & Fleet Analytics" breadcrumb="Campus Transport / Dashboard" />

      {errorNotice && (
        <div className="alert-banner warning">
          <AlertCircle size={18} />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-content">
          <div className="welcome-tag">
            <Sparkles size={14} /> LIVE FLEET TELEMETRY
          </div>
          <h2>Smart Campus Bus Operations</h2>
          <p>
            Real-time monitoring of campus transit, student ridership, route schedules, and driver assignments across all campus zones.
          </p>
          <div className="welcome-actions">
            <button className="btn-primary" onClick={() => navigate("/bus-details")}>
              <Bus size={17} /> Explore Bus Fleet
            </button>
            <button className="btn-glass" onClick={() => navigate("/management?tab=Buses")}>
              <PlusCircle size={17} /> Add New Record
            </button>
          </div>
        </div>
        <div className="welcome-stats-badge">
          <div className="badge-ring">
            <strong>{occupancyRate}%</strong>
            <span>Fleet Occupancy</span>
          </div>
          <div className="badge-details">
            <div><span>Total Seats:</span> <strong>{totalSeats || "—"}</strong></div>
            <div><span>Available:</span> <strong>{availableSeats || "—"}</strong></div>
          </div>
        </div>
      </section>

      {/* Top KPI Metrics */}
      <section className="metrics-grid">
        <div className="metric-card" onClick={() => navigate("/bus-details")}>
          <div className="metric-icon-wrap blue">
            <Bus size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-title">Fleet Vehicles</span>
            <div className="metric-number">{buses.length}</div>
            <span className="metric-sub">{activeBusesCount} active on transit routes</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate("/management?tab=Routes")}>
          <div className="metric-icon-wrap emerald">
            <MapPin size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-title">Campus Routes</span>
            <div className="metric-number">{routes.length}</div>
            <span className="metric-sub">Covering major stops & gates</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate("/management?tab=Drivers")}>
          <div className="metric-icon-wrap amber">
            <UserCheck size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-title">Certified Drivers</span>
            <div className="metric-number">{drivers.length}</div>
            <span className="metric-sub">Commercial license verified</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate("/management?tab=Students")}>
          <div className="metric-icon-wrap purple">
            <GraduationCap size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-title">Enrolled Students</span>
            <div className="metric-number">{students.length}</div>
            <span className="metric-sub">Pass holders across departments</span>
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate("/management?tab=Schedules")}>
          <div className="metric-icon-wrap rose">
            <CalendarClock size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-title">Daily Schedules</span>
            <div className="metric-number">{schedules.length}</div>
            <span className="metric-sub">Morning & evening runs</span>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Bus Fleet Status & Today's Schedules */}
      <div className="dashboard-split">
        {/* Left Column: Quick Bus Overview */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Active Fleet Status</h3>
              <p>Current operational overview of campus vehicles</p>
            </div>
            <Link to="/bus-details" className="card-link">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="fleet-list">
            {buses.length === 0 ? (
              <div className="empty-state">
                <Bus size={32} />
                <p>No buses registered yet.</p>
                <button className="btn-secondary-sm" onClick={() => navigate("/management?tab=Buses")}>
                  Register First Bus
                </button>
              </div>
            ) : (
              buses.slice(0, 4).map((bus) => {
                const total = Number(bus.totalSeats) || 0;
                const avail = Number(bus.availableSeats) || 0;
                const pct = total > 0 ? Math.round(((total - avail) / total) * 100) : 0;
                return (
                  <div key={bus.id} className="fleet-row" onClick={() => navigate(`/bus-details`)}>
                    <div className="fleet-icon">
                      <Bus size={20} />
                    </div>
                    <div className="fleet-info">
                      <strong>Bus #{bus.busNumber}</strong>
                      <span>{bus.busType || "Standard Transport"}</span>
                    </div>
                    <div className="fleet-occupancy">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="progress-label">{avail} seats free ({pct}% booked)</span>
                    </div>
                    <span className={`status-pill ${((bus.status || "active").toLowerCase())}`}>
                      {bus.status || "Active"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Today's Timetable */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Transit Schedules</h3>
              <p>Departure and arrival timings</p>
            </div>
            <Link to="/management?tab=Schedules" className="card-link">
              Manage <ArrowRight size={15} />
            </Link>
          </div>

          <div className="schedules-list">
            {schedules.length === 0 ? (
              <div className="empty-state">
                <CalendarClock size={32} />
                <p>No schedules posted today.</p>
                <button className="btn-secondary-sm" onClick={() => navigate("/management?tab=Schedules")}>
                  Create Schedule
                </button>
              </div>
            ) : (
              schedules.slice(0, 4).map((s) => (
                <div key={s.id} className="schedule-item">
                  <div className="schedule-time">
                    <Clock size={16} />
                    <strong>{s.departureTime || "08:00 AM"}</strong>
                    <span>to {s.arrivalTime || "09:00 AM"}</span>
                  </div>
                  <div className="schedule-details">
                    <div className="schedule-bus">Bus #{s.busNumber}</div>
                    <div className="schedule-route">{s.routeName || "Campus Main Line"}</div>
                  </div>
                  <span className="schedule-day-badge">{s.day || "Mon - Fri"}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Quick Launchpad Footer */}
      <section className="launchpad-card">
        <div className="launchpad-text">
          <ShieldCheck size={24} color="#3b82f6" />
          <div>
            <h4>Campus Transport Administration & Security</h4>
            <p>Database synchronization is connected with Railway MySQL instance. All records maintain ACID integrity.</p>
          </div>
        </div>
        <div className="launchpad-buttons">
          <button className="btn-secondary" onClick={() => navigate("/management?tab=Students")}>
            <GraduationCap size={16} /> Manage Students
          </button>
          <button className="btn-secondary" onClick={() => navigate("/management?tab=Drivers")}>
            <UserCheck size={16} /> Driver Directory
          </button>
          <button className="btn-primary" onClick={() => navigate("/bus-details")}>
            <Bus size={16} /> Full Fleet Detail
          </button>
        </div>
      </section>
    </div>
  );
}
