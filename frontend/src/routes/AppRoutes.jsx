import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import UploadPDF from "../pages/UploadPDF";
import Flashcards from "../pages/Flashcards";
import History from "../pages/History";
import Premium from "../pages/Premium";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPDF />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/history" element={<History />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;