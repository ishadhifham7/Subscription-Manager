import { useContext, type JSX } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./auth/authContext";

import DashboardeLayout from "./common/layout/DashboardeLayout";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";

// 🔐 Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const context = useContext(AuthContext);

  if (!context) return null;

  const { auth } = context;

  // ⏳ Still checking auth
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  // ❌ Not logged in → block access
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow access
  return children;
};

function App() {
  const context = useContext(AuthContext);

  if (!context) return null;

  const { auth } = context;

  if (auth.loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          auth.isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      {/* 🔐 Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardeLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />

      {/* 🔁 Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
