import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login will be integrated later.");
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to manage bookings, tickets, and campus operations."
      sideTitle="A modern campus platform for daily operations"
      sideText="Access your dashboard, monitor resources, manage maintenance issues, and keep workflows moving with a clean, role-aware interface."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />

        <TextInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </motion.p>
        ) : null}

        <div className="pt-2 space-y-3">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </div>

        <p className="pt-2 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium text-orange-400 hover:text-orange-300">
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;