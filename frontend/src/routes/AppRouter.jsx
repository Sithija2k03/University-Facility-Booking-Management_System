import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import GuestRoute from "../auth/GuestRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import ProfilePage from "../pages/ProfilePage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ResourceListPage from "../pages/ResourceListPage";
import CreateResourcePage from "../pages/CreateResourcePage";
import EditResourcePage from "../pages/EditResourcePage";
import CreateBookingPage from "../pages/CreateBookingPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import AllBookingsPage from "../pages/AllBookingsPage";
import CreateTicketPage from "../pages/CreateTicketPage";
import MyTicketsPage from "../pages/MyTicketsPage";
import TicketDetailPage from "../pages/TicketDetailPage";
import AllTicketsPage from "../pages/AllTicketsPage";
import ManageTicketPage from "../pages/ManageTicketPage";
import { useAuth } from "../auth/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import LandingPage from "../pages/LandingPage";


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
      {/*Landing Page*/}
      <Route path="/" element={<LandingPage />} />

      {/* AUTH */}
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

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <DashboardRouter />
          </ProtectedPage>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <ProfilePage />
          </ProtectedPage>
        }
      />

      {/* RESOURCES */}
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

      <Route
        path="/resources/edit/:id"
        element={
          <ProtectedPage allowedRoles={["ADMIN"]}>
            <EditResourcePage />
          </ProtectedPage>
        }
      />

      <Route
        path="/bookings/create"
        element={
          <ProtectedPage allowedRoles={["USER"]}>
            <CreateBookingPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/bookings/my"
        element={
          <ProtectedPage allowedRoles={["USER"]}>
            <MyBookingsPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/bookings/all"
        element={
          <ProtectedPage allowedRoles={["ADMIN"]}>
            <AllBookingsPage />
          </ProtectedPage>
        }
      />

      {/* TICKETS */}
      <Route
        path="/tickets/create"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <CreateTicketPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/tickets/my"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN"]}>
            <MyTicketsPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/tickets/:id"
        element={
          <ProtectedPage allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
            <TicketDetailPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/tickets/all"
        element={
          <ProtectedPage allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <AllTicketsPage />
          </ProtectedPage>
        }
      />

      <Route
        path="/tickets/:id/manage"
        element={
          <ProtectedPage allowedRoles={["ADMIN", "TECHNICIAN"]}>
            <ManageTicketPage />
          </ProtectedPage>
        }
      />

      {/* DEFAULT */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;