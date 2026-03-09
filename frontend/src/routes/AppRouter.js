import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import ProjectPage from "../features/pages/ProjectPage.js";
import BoardPage from "../features/pages/BoardPage.js";
import RegisterPage from "../features/pages/RegisterPage.js";
import EditUserPage from "../features/pages/EditUserPage.js";
import ProtectedRoute from "../utils/ProtectedRoute";
import LogoutHandler from "../utils/LogoutHandler";
import PermissionsPage from "../features/pages/PermissionsPage.js";
import ProfilePage from "../features/pages/ProfilePage.js";
import TicketPage from "../features/pages/TicketPage.js";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <BoardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-user"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <EditUserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permissions"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <PermissionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<LogoutHandler />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
