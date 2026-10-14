import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getApiBase } from "../api/client";
import Navbar from "../components/Navbar";
import { 
  Bus, 
  MapPin, 
  UserCheck, 
  GraduationCap, 
  CalendarClock, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X
} from "lucide-react";

const modules = {
  Buses: {
    endpoint: "buses",
    icon: Bus,
    description: "Manage vehicle fleet records, passenger capacity, and maintenance status.",
    fields: [
      ["busNumber", "Bus Number", "text"],
      ["busType", "Bus Type (e.g. AC Deluxe, Mini Shuttle)", "text"],
      ["totalSeats", "Total Seats", "number"],
      ["availableSeats", "Available Seats", "number"],
      ["status", "Status (Active / Maintenance / Standby)", "text"],
    ],
  },
  Routes: {
    endpoint: "routes",
    icon: MapPin,
    description: "Define campus transit lines, origin points, destinations, and intermediate halts.",
    fields: [
      ["routeName", "Route Name", "text"],
      ["startPoint", "Start Point", "text"],
      ["destination", "Destination", "text"],
      ["stops", "Stops (comma separated)", "text"],
    ],
  },
  Drivers: {
    endpoint: "drivers",
    icon: UserCheck,
    description: "Driver roster, licensing verification, contact telephone numbers, and addresses.",
    fields: [
      ["driverName", "Driver Name", "text"],
      ["phoneNumber", "Phone Number", "text"],
      ["licenseNumber", "License Number", "text"],
      ["address", "Address", "text"],
    ],
  },
  Students: {
    endpoint: "students",
    icon: GraduationCap,
    description: "Enrolled student passengers, university roll numbers, and academic departments.",
    fields: [
      ["studentName", "Student Name", "text"],
      ["rollNumber", "Roll Number", "text"],
      ["phoneNumber", "Phone Number", "text"],
      ["department", "Department", "text"],
      ["year", "Academic Year (1-4)", "number"],
    ],
  },
  Schedules: {
    endpoint: "schedules",
    icon: CalendarClock,
    description: "Daily timetable, assigned buses, route links, departure and arrival timings.",
    fields: [
      ["busNumber", "Bus Number", "text"],
      ["routeName", "Route Name", "text"],
      ["departureTime", "Departure Time (e.g. 08:30 AM)", "text"],
      ["arrivalTime", "Arrival Time (e.g. 09:15 AM)", "text"],
      ["day", "Day / Frequency (e.g. Mon-Fri)", "text"],
    ],
  },
};

export default function Management() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "Buses";
  const [active, setActive] = useState(modules[initialTab] ? initialTab : "Buses");

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);

  const current = modules[active] || modules.Buses;
  const ModuleIcon = current.icon;

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && modules[tabParam] && tabParam !== active) {
      setActive(tabParam);
    }
  }, [searchParams]);

  function switchTab(name) {
    setActive(name);
    setSearchParams({ tab: name });
  }

  async function loadRecords() {
    setLoading(true);
    const api = getApiBase();
    try {
      const response = await fetch(`${api}/${current.endpoint}`);
      if (!response.ok) throw new Error("Could not load records from server.");
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      setRecords([]);
      setMessage(`Unable to connect to backend at [${api}]. Click "Backend Disconnected" in the top bar to set your Railway URL.`);
      setMessageType("warning");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setForm({});
    setEditingId(null);
    setSearch("");
    loadRecords();
  }, [active]);

  function startEdit(record) {
    setEditingId(record.id);
    setForm(Object.fromEntries(current.fields.map(([key]) => [key, record[key] ?? ""])));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({});
  }

  async function saveRecord(event) {
    event.preventDefault();
    setMessage("");

    const payload = {};
    current.fields.forEach(([key, , type]) => {
      const value = form[key] ?? "";
      payload[key] = type === "number" && value !== "" ? Number(value) : value;
    });

    try {
      const api = getApiBase();
      const response = await fetch(
        `${api}/${current.endpoint}${editingId !== null ? `/${editingId}` : ""}`,
        {
          method: editingId !== null ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || "Unable to save record.");
      }

      setMessage(editingId !== null ? "Record updated successfully." : "Record added successfully.");
      setMessageType("success");
      cancelEdit();
      await loadRecords();
    } catch (error) {
      setMessage(error.message || "Unable to save record.");
      setMessageType("danger");
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const api = getApiBase();
      const response = await fetch(`${api}/${current.endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete record.");
      setMessage("Record deleted successfully.");
      setMessageType("success");
      if (editingId === id) cancelEdit();
      await loadRecords();
    } catch (error) {
      setMessage(error.message || "Unable to delete record.");
      setMessageType("danger");
    }
  }

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="page-container">
      <Navbar title={`${active} Management & Records`} breadcrumb={`Campus Transport / Management / ${active}`} />

      {message && (
        <div className={`alert-banner ${messageType}`}>
          {messageType === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message}</span>
        </div>
      )}

      {/* Module Selector Ribbon */}
      <div className="module-ribbon">
        {Object.keys(modules).map((name) => {
          const TabIcon = modules[name].icon;
          return (
            <button
              key={name}
              className={`ribbon-tab ${active === name ? "active" : ""}`}
              onClick={() => switchTab(name)}
            >
              <TabIcon size={18} />
              <span>{name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Section */}
      <section className="management-panel">
        <div className="panel-heading">
          <div className="panel-heading-left">
            <div className="module-avatar-icon">
              <ModuleIcon size={22} />
            </div>
            <div>
              <span className="eyebrow">DATABASE CRUD OPERATIONS</span>
              <h2>{active} Management</h2>
              <p>{current.description}</p>
            </div>
          </div>
          <div className="panel-record-counter">
            <strong>{records.length}</strong>
            <span>Total Records</span>
          </div>
        </div>

        {/* Add / Edit Form Card */}
        <form onSubmit={saveRecord} className="record-form-card">
          <div className="form-card-header">
            <h3>{editingId !== null ? `Edit ${active.slice(0, -1)} #${editingId}` : `Add New ${active.slice(0, -1)}`}</h3>
            {editingId !== null && (
              <button type="button" className="btn-cancel-edit" onClick={cancelEdit}>
                <X size={15} /> Cancel Edit
              </button>
            )}
          </div>

          <div className="form-fields-grid">
            {current.fields.map(([key, label, type]) => (
              <div key={key} className="form-field-group">
                <label htmlFor={key}>{label}</label>
                <input
                  id={key}
                  type={type}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={form[key] ?? ""}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key === current.fields[0][0]}
                />
              </div>
            ))}
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-primary">
              <Plus size={16} /> {editingId !== null ? "Update Record" : "Save Record"}
            </button>
            {editingId !== null && (
              <button type="button" className="btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Search & Records Table */}
        <div className="table-wrapper-card">
          <div className="table-header-row">
            <div>
              <h3>{active} Database View</h3>
              <p>Showing {filteredRecords.length} records</p>
            </div>
            <div className="table-search-input">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder={`Filter ${active.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Fetching records from backend...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="empty-table-state">
              <ModuleIcon size={36} />
              <p>{search ? "No matching records found." : `No ${active.toLowerCase()} in the database.`}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    {current.fields.map(([key, label]) => (
                      <th key={key}>{label.split("(")[0]}</th>
                    ))}
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="id-cell">#{record.id}</td>
                      {current.fields.map(([key]) => (
                        <td key={key}>
                          {key === "status" ? (
                            <span className={`status-pill ${(record[key] || "active").toLowerCase()}`}>
                              {record[key] || "Active"}
                            </span>
                          ) : (
                            record[key] ?? "—"
                          )}
                        </td>
                      ))}
                      <td className="actions-cell">
                        <button
                          type="button"
                          className="action-btn edit"
                          onClick={() => startEdit(record)}
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="action-btn delete"
                          onClick={() => deleteRecord(record.id)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

