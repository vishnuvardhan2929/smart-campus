import { useEffect, useState } from "react";
import "./App.css";

const modules = {
  Buses: {
    endpoint: "buses",
    fields: [
      ["busNumber", "Bus Number"],
      ["busType", "Bus Type"],
      ["totalSeats", "Total Seats", "number"],
      ["availableSeats", "Available Seats", "number"],
      ["status", "Status"],
    ],
  },
  Routes: {
    endpoint: "routes",
    fields: [
      ["routeName", "Route Name"],
      ["startPoint", "Start Point"],
      ["destination", "Destination"],
      ["stops", "Stops"],
    ],
  },
  Drivers: {
    endpoint: "drivers",
    fields: [
      ["driverName", "Driver Name"],
      ["phoneNumber", "Phone Number"],
      ["licenseNumber", "License Number"],
      ["address", "Address"],
    ],
  },
  Students: {
    endpoint: "students",
    fields: [
      ["studentName", "Student Name"],
      ["rollNumber", "Roll Number"],
      ["phoneNumber", "Phone Number"],
      ["department", "Department"],
      ["year", "Year", "number"],
    ],
  },
  Schedules: {
    endpoint: "schedules",
    fields: [
      ["busNumber", "Bus Number"],
      ["routeName", "Route Name"],
      ["departureTime", "Departure Time"],
      ["arrivalTime", "Arrival Time"],
      ["day", "Day"],
    ],
  },
};

const rawApi = (import.meta.env.VITE_API_URL || "http://localhost:8080/api").trim().replace(/\/+$/, "");
const API = rawApi.endsWith("/api") ? rawApi : `${rawApi}/api`;

function App() {
  const [active, setActive] = useState("Buses");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const current = modules[active];

  async function loadRecords() {
    setLoading(true);
    try {
      const response = await fetch(`${API}/${current.endpoint}`);
      if (!response.ok) throw new Error("Could not load records.");
      const data = await response.json();
      setRecords(Array.isArray(data) ? data : []);
      setMessage("");
    } catch {
      setRecords([]);
      setMessage("Unable to connect to the backend. Check that Spring Boot is running on port 8080.");
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
    setForm(Object.fromEntries(current.fields.map(([key]) => [
      key,
      record[key] ?? "",
    ])));
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
      const response = await fetch(
        `${API}/${current.endpoint}${editingId !== null ? `/${editingId}` : ""}`,
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
      cancelEdit();
      await loadRecords();
    } catch (error) {
      setMessage(error.message || "Unable to save record.");
    }
  }

  async function deleteRecord(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await fetch(`${API}/${current.endpoint}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Unable to delete record.");
      setMessage("Record deleted successfully.");
      if (editingId === id) cancelEdit();
      await loadRecords();
    } catch (error) {
      setMessage(error.message || "Unable to delete record.");
    }
  }

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value ?? "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const stats = [
    { label: "Total Buses", value: "Buses", icon: "▣" },
    { label: "Routes", value: "Routes", icon: "↗" },
    { label: "Drivers", value: "Drivers", icon: "♙" },
    { label: "Students", value: "Students", icon: "♧" },
    { label: "Schedules", value: "Schedules", icon: "◷" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🚌</div>
          <div>
            <h2>CampusRide</h2>
            <span>TRANSPORT SYSTEM</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>
        <nav>
          {Object.keys(modules).map((name) => (
            <button
              key={name}
              className={`nav-item ${active === name ? "selected" : ""}`}
              onClick={() => setActive(name)}
            >
              <span className="nav-icon">
                {name === "Buses" ? "▣" : name === "Routes" ? "↗" : name === "Drivers" ? "♙" : name === "Students" ? "♧" : "◷"}
              </span>
              {name}
              <span className="nav-arrow">›</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="status-dot"></div>
          <div>
            <strong>System Status</strong>
            <span>Campus transport portal</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Campus Management / {active}</p>
            <h1>Smart Campus Bus Management</h1>
          </div>
          <div className="admin-chip">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Transport Admin</span>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">CAMPUS TRANSPORT PORTAL</span>
            <h2>Manage your campus, smarter.</h2>
            <p>Organize buses, routes, drivers, students and daily schedules in one place.</p>
          </div>
          <div className="welcome-art">🚌</div>
        </section>

        <section className="stats-grid">
          {stats.map((item) => (
            <button
              key={item.value}
              className={`stat-card ${active === item.value ? "stat-active" : ""}`}
              onClick={() => setActive(item.value)}
            >
              <div className="stat-top">
                <span>{item.label}</span>
                <span className="stat-icon">{item.icon}</span>
              </div>
              <strong>{item.value === active ? records.length : "View"}</strong>
              <span className="stat-foot">Manage {item.value.toLowerCase()} <span>→</span></span>
            </button>
          ))}
        </section>

        <section className="management-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">RECORD MANAGEMENT</span>
              <h2>{active} Management</h2>
              <p>Add, view, update and remove {active.toLowerCase()} records.</p>
            </div>
            <span className="record-count">{records.length} records</span>
          </div>

          {message && (
            <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
              {message}
              <button onClick={() => setMessage("")}>×</button>
            </div>
          )}

          <form className="record-form" onSubmit={saveRecord}>
            <h3>{editingId !== null ? "✎ Update Record" : "+ Add New Record"}</h3>
            <div className="form-grid">
              {current.fields.map(([key, label, type]) => (
                <label className="field" key={key}>
                  <span>{label} <i>*</i></span>
                  <input
                    type={type || "text"}
                    value={form[key] ?? ""}
                    required
                    min={type === "number" ? 0 : undefined}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="form-actions">
              {editingId !== null && (
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
              <button className="btn-primary" type="submit">
                {editingId !== null ? "Save Changes" : "+ Add Record"}
              </button>
            </div>
          </form>

          <div className="table-heading">
            <div>
              <h3>All {active}</h3>
              <p>Records stored in your campus database</p>
            </div>
            <input
              className="search-input"
              placeholder="⌕  Search records..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  {current.fields.map(([key, label]) => <th key={key}>{label}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={current.fields.length + 2} className="empty-state">Loading records...</td></tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={current.fields.length + 2} className="empty-state">
                      <div className="empty-icon">▤</div>
                      <strong>No records found</strong>
                      <p>Add a new record using the form above.</p>
                    </td>
                  </tr>
                ) : filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td><span className="id-badge">#{record.id}</span></td>
                    {current.fields.map(([key]) => (
                      <td key={key}>
                        {key === "status" ? (
                          <span className={`status-badge ${String(record[key]).toLowerCase() === "active" ? "active-status" : ""}`}>
                            {record[key]}
                          </span>
                        ) : String(record[key] ?? "—")}
                      </td>
                    ))}
                    <td>
                      <div className="row-actions">
                        <button className="edit-btn" onClick={() => startEdit(record)} title="Edit record">✎</button>
                        <button className="delete-btn" onClick={() => deleteRecord(record.id)} title="Delete record">⌫</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel-footer">
            <span>Showing {filteredRecords.length} of {records.length} records</span>
            <button className="refresh-btn" onClick={loadRecords}>↻ Refresh data</button>
          </div>
        </section>

        <footer className="page-footer">
          <span>© CampusRide · Smart Campus Bus Management System</span>
          <span>Powered by React + Spring Boot</span>
        </footer>
      </main>
    </div>
  );
}

export default App;