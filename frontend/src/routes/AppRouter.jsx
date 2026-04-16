import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import GuestRoute from "../auth/GuestRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ResourceListPage from "../pages/ResourceListPage";
import CreateResourcePage from "../pages/CreateResourcePage";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/layout/AppLayout";

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <AdminDashboard />;
  if (user.role === "TECHNICIAN") return <TechnicianDashboard />;
  return <UserDashboard />;
}

function ProtectedPage({ children, allowedRoles }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function AppRouter() {
  return (
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
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <DashboardRouter />
          </ProtectedPage>
        }
      />

      <Route
        path="/resources"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <ResourceListPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/resources/create"
        element={
          <ProtectedPage allowedRoles={["ADMIN"]}>
            <CreateResourcePage />
          </ProtectedPage>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;