import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await register(form.name, form.email, form.password);
      setSuccess("Registration successful. Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please check your details."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button type="submit" disabled={submitting} style={styles.button}>
          {submitting ? "Registering..." : "Register"}
        </button>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f5f5f5",
  },
  card: {
    width: "360px",
    padding: "24px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    margin: 0,
  },
  success: {
    color: "green",
    margin: 0,
  },
  switchText: {
    margin: 0,
    textAlign: "center",
  },
};

export default RegisterPage;