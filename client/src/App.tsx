import { Navigate, Route, Routes } from "react-router-dom";
import DashboardeLayout from "./common/layout/DashboardeLayout";
import UserPage from "./pages/UserPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardeLayout />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
