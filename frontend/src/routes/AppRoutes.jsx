import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import UploadPDF from "../pages/UploadPDF";
import Flashcards from "../pages/Flashcards";
import LibraryPage from "../pages/Library";
import HistoryPage from "../pages/History";
import PremiumPage from "../pages/Premium";
import CreditsPage from "../pages/Credits";
import SettingsPage from "../pages/Settings";
import SupportPage from "../pages/Support";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPDF />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;