import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../auth/AuthContext";
import PageShell from "../components/layout/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import TextInput from "../components/ui/TextInput";

function ProfilePage() {
  const { user, credentials, buildBasicAuthHeader, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(user || null);
  const [form, setForm] = useState({
    name: user?.name || "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const authHeader = useMemo(() => {
    if (!credentials) return "";
    return buildBasicAuthHeader(credentials.email, credentials.password);
  }, [credentials, buildBasicAuthHeader]);

  const formatDateTime = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosClient.get("/api/users/me", {
        headers: {
          Authorization: authHeader,
        },
      });

      setProfile(response.data);
      setForm({
        name: response.data.name || "",
        password: "",
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!credentials) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [credentials]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await axiosClient.put(
        "/api/users/me",
        {
          name: form.name,
          password: form.password || null,
        },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      setSuccess("Profile updated successfully");
      setForm((prev) => ({
        ...prev,
        password: "",
      }));

      await fetchProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await axiosClient.delete("/api/users/me", {
        headers: {
          Authorization: authHeader,
        },
      });

      logout();
      navigate("/register");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete profile");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PageShell
        title="Profile Settings"
        subtitle="Manage your account information."
      >
        <Card>
          <p className="text-sm text-slate-400">Loading profile...</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Profile Settings"
      subtitle="Update your personal information and account settings."
    >
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white shadow-lg">
              {profile?.name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "U"}
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-100">
              {profile?.name || user?.name}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {profile?.email || user?.email}
            </p>

            <span className="mt-4 inline-flex rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-medium text-orange-300">
              {profile?.role || user?.role}
            </span>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-300">
            <p>
              <span className="text-slate-500">Provider:</span>{" "}
              {profile?.provider || "LOCAL"}
            </p>
            <p>
              <span className="text-slate-500">Created At:</span>{" "}
              {formatDateTime(profile?.createdAt)}
            </p>
            <p>
              <span className="text-slate-500">Updated At:</span>{" "}
              {formatDateTime(profile?.updatedAt)}
            </p>
          </div>
        </Card>

        <Card>
          <form onSubmit={handleUpdate} className="space-y-5">
            <TextInput
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

            <TextInput
              label="New Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Saving..." : "Update Profile"}
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Profile"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageShell>
  );
}

export default ProfilePage;