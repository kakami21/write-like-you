import { Navigate, Route, Routes } from "react-router";
import { ReviewListPage } from "./pages/ReviewListPage";

export function App() {
  return (
    <Routes>
      <Route path="/reviews" element={<ReviewListPage />} />
      <Route path="*" element={<Navigate to="/reviews" replace />} />
    </Routes>
  );
}
