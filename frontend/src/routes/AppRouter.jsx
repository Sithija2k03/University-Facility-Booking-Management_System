import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import GuestRoute from "../auth/GuestRoute";
import Navbar from "../components/Navbar";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ResourceListPage from "../pages/ResourceListPage";
import { useAuth } from "../auth/AuthContext";

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  if (user.role === "TECHNICIAN") return <TechnicianDashboard />;
  return <UserDashboard />;
}

function AppRouter() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
              <ResourceListPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default AppRouter;