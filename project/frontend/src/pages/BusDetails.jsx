import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bus, 
  MapPin, 
  UserCheck, 
  CalendarClock, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  AlertCircle,
  Users, 
  CheckCircle2, 
  X, 
  Sparkles,
  Phone,
  FileBadge,
  Clock
} from "lucide-react";
import { fetchFromApi } from "../api/client";
import Navbar from "../components/Navbar";

export default function BusDetails() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [busRes, routeRes, driverRes, schedRes] = await Promise.allSettled([
          fetchFromApi("buses"),
          fetchFromApi("routes"),
          fetchFromApi("drivers"),
          fetchFromApi("schedules"),
        ]);
        if (busRes.status === "fulfilled" && Array.isArray(busRes.value)) setBuses(busRes.value);
        if (routeRes.status === "fulfilled" && Array.isArray(routeRes.value)) setRoutes(routeRes.value);
        if (driverRes.status === "fulfilled" && Array.isArray(driverRes.value)) setDrivers(driverRes.value);
        if (schedRes.status === "fulfilled" && Array.isArray(schedRes.value)) setSchedules(schedRes.value);
      } catch (err) {
        console.error("Error loading bus details data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBuses = buses.filter((b) => {
    const matchesSearch = 
      (b.busNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.busType || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === "ALL" || 
      (b.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container">
      <Navbar title="Fleet Roster & Vehicle Inspector" breadcrumb="Campus Transport / Bus Details" />

      {/* Header bar with controls */}
      <div className="page-header-bar">
        <div>
          <h2>Campus Fleet Directory</h2>
          <p>Inspect real-time seating availability, route telemetry, and driver allocations for each bus.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-primary" onClick={() => navigate("/management?tab=Buses")}>
            <Plus size={16} /> Register New Bus
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-controls-card">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by bus number or type (e.g. 101, AC Deluxe)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="status-filter-pills">
          {["ALL", "Active", "Maintenance", "Standby"].map((status) => (
            <button
              key={status}
              className={`filter-pill ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bus Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading campus fleet data...</p>
        </div>
      ) : filteredBuses.length === 0 ? (
        <div className="empty-state-card">
          <Bus size={48} />
          <h3>No buses match your criteria</h3>
          <p>Try searching with another keyword or register a new bus into the campus system.</p>
          <button className="btn-primary" onClick={() => navigate("/management?tab=Buses")}>
            <Plus size={16} /> Add Bus Record
          </button>
        </div>
      ) : (
        <div className="bus-grid">
          {filteredBuses.map((bus) => {
            const total = Number(bus.totalSeats) || 40;
            const available = Number(bus.availableSeats) ?? 20;
            const occupied = Math.max(0, total - available);
            const occupancyPct = total > 0 ? Math.round((occupied / total) * 100) : 0;

            // Associate route & schedule
            const schedule = schedules.find(s => String(s.busNumber) === String(bus.busNumber));
            const route = routes.find(r => schedule && r.routeName === schedule.routeName) || routes[0];
            const driver = drivers[0];

            return (
              <div key={bus.id} className="bus-card" onClick={() => setSelectedBus({ ...bus, route, driver, schedule })}>
                <div className="bus-card-top">
                  <div className="bus-badge">
                    <Bus size={20} />
                    <span>#{bus.busNumber}</span>
                  </div>
                  <span className={`status-pill ${(bus.status || "active").toLowerCase()}`}>
                    {bus.status || "Active"}
                  </span>
                </div>

                <div className="bus-type-heading">
                  <h3>{bus.busType || "Standard Campus Coach"}</h3>
                  <span className="bus-id-sub">System ID: CAMPUS-BUS-{bus.id}</span>
                </div>

                {/* Seating Progress */}
                <div className="seating-progress-box">
                  <div className="seating-labels">
                    <span>Capacity Occupancy</span>
                    <strong>{occupancyPct}% ({occupied}/{total})</strong>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${occupancyPct > 85 ? "danger" : occupancyPct > 60 ? "warning" : "good"}`} 
                      style={{ width: `${occupancyPct}%` }}
                    ></div>
                  </div>
                  <div className="seating-stat-row">
                    <span><strong>{available}</strong> seats available</span>
                    <span><strong>{total}</strong> total berths</span>
                  </div>
                </div>

                {/* Route & Schedule overview */}
                <div className="bus-info-list">
                  <div className="bus-info-item">
                    <MapPin size={15} />
                    <div>
                      <small>Assigned Route</small>
                      <span>{route ? route.routeName : "Central Campus Express"}</span>
                    </div>
                  </div>

                  <div className="bus-info-item">
                    <CalendarClock size={15} />
                    <div>
                      <small>Daily Schedule</small>
                      <span>{schedule ? `${schedule.departureTime} → ${schedule.arrivalTime}` : "07:30 AM → 08:45 AM"}</span>
                    </div>
                  </div>

                  <div className="bus-info-item">
                    <UserCheck size={15} />
                    <div>
                      <small>Assigned Driver</small>
                      <span>{driver ? driver.driverName : "Campus Senior Driver"}</span>
                    </div>
                  </div>
                </div>

                <div className="bus-card-actions">
                  <button 
                    className="btn-card-inspect"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBus({ ...bus, route, driver, schedule });
                    }}
                  >
                    Inspect Seat Map & Telemetry
                  </button>
                  <button 
                    className="btn-card-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/management?tab=Buses");
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Bus Detail Modal */}
      {selectedBus && (
        <div className="modal-overlay" onClick={() => setSelectedBus(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-info">
                <div className="bus-badge modal">
                  <Bus size={24} />
                  <span>Bus #{selectedBus.busNumber}</span>
                </div>
                <div>
                  <h2>{selectedBus.busType || "Campus Transport Coach"}</h2>
                  <p>Registration No. DL-01-CAMPUS-{selectedBus.busNumber} • Status: <strong>{selectedBus.status || "Active"}</strong></p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedBus(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Seating Layout Diagram */}
              <div className="seat-map-section">
                <h4>Interactive Cabin Seating Layout</h4>
                <p>Showing seat distribution for Bus #{selectedBus.busNumber}</p>
                
                <div className="seat-map-grid">
                  <div className="bus-cabin-front">
                    <span>Driver Seat 💺</span>
                    <span className="front-windshield">Front Windshield</span>
                  </div>

                  <div className="seats-container">
                    {Array.from({ length: Math.min(32, Number(selectedBus.totalSeats) || 28) }).map((_, i) => {
                      const isOccupied = i < ((Number(selectedBus.totalSeats) || 28) - (Number(selectedBus.availableSeats) || 12));
                      return (
                        <div key={i} className={`seat-pill ${isOccupied ? "occupied" : "available"}`}>
                          <span>{i + 1}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="seat-legend">
                    <div><span className="legend-dot available"></span> Available Seat</div>
                    <div><span className="legend-dot occupied"></span> Booked / Occupied</div>
                  </div>
                </div>
              </div>

              {/* Driver & Route Specs */}
              <div className="specs-section">
                <h4>Fleet Operations Details</h4>
                <div className="specs-cards">
                  <div className="spec-item">
                    <MapPin size={18} className="spec-icon" />
                    <div>
                      <strong>Route Coverage</strong>
                      <p>{selectedBus.route ? `${selectedBus.route.startPoint || "Gate 1"} to ${selectedBus.route.destination || "Campus Central"}` : "North Campus to Main Admin Building"}</p>
                      <small>Stops: {selectedBus.route?.stops || "Gate 2, Library, Science Block, Hostel"}</small>
                    </div>
                  </div>

                  <div className="spec-item">
                    <UserCheck size={18} className="spec-icon" />
                    <div>
                      <strong>Designated Driver</strong>
                      <p>{selectedBus.driver ? selectedBus.driver.driverName : "Certified Campus Chauffeur"}</p>
                      <small>Phone: {selectedBus.driver?.phoneNumber || "+91 98765 43210"} • License: {selectedBus.driver?.licenseNumber || "DL-9082-2024"}</small>
                    </div>
                  </div>

                  <div className="spec-item">
                    <Clock size={18} className="spec-icon" />
                    <div>
                      <strong>Daily Run Window</strong>
                      <p>{selectedBus.schedule ? `${selectedBus.schedule.departureTime} Departure • ${selectedBus.schedule.arrivalTime} Arrival` : "08:15 AM Departure"}</p>
                      <small>Operating: {selectedBus.schedule?.day || "Monday through Saturday"}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedBus(null)}>
                Close
              </button>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setSelectedBus(null);
                  navigate("/management?tab=Buses");
                }}
              >
                Manage or Modify Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

