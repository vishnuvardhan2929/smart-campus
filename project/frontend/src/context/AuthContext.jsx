import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: "admin-1",
  name: "Campus Administrator",
  email: "admin@campus.edu",
  role: "Admin",
  department: "Transport Management",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("campus_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("campus_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("campus_user");
    }
  }, [user]);

  function login(email, password, role = "Admin") {
    // Campus auth logic with persistent state
    const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ");
    const formattedName = nameFromEmail
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const newUser = {
      id: "usr-" + Date.now(),
      name: formattedName || "Campus User",
      email: email,
      role: role,
      department: role === "Student" ? "Computer Science" : role === "Driver" ? "Fleet Operations" : "Transport Management",
    };
    setUser(newUser);
    return newUser;
  }

  function register(data) {
    const newUser = {
      id: "usr-" + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || "Student",
      department: data.department || "General",
      phone: data.phone || "",
    };
    setUser(newUser);
    return newUser;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
