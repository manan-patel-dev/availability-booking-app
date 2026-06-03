import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Availability from "../pages/Availability";
import NotFound from "../pages/NotFound";
import PublicBooking from "../pages/PublicBooking";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/availability"
        element={
          <ProtectedRoute>
            <Availability />
          </ProtectedRoute>
        }
      />

      <Route path="/booking/:slug" element={<PublicBooking />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
