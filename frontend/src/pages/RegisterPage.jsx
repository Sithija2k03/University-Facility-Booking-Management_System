import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import AuthLayout from "../components/layout/AuthLayout";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

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
      setSuccess("Registration successful. Redirecting to login...");
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
    <AuthLayout
      title="Create account"
      subtitle="Set up your account to access the Smart Campus platform."
      sideTitle="One place to handle campus facilities and support"
      sideText="Create your account and start using a streamlined system for resources, maintenance, and operations with secure role-based access."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Full name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

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
          placeholder="Create a password"
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

        {success ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
          >
            {success}
          </motion.p>
        ) : null}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Register"}
          </Button>
        </div>

        <p className="pt-2 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-orange-400 hover:text-orange-300">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;