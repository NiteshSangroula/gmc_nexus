import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Dashboard from "../pages/Dashboard";
=======

import Dashboard from "../pages/Dashboard";
import UploadPDF from "../pages/UploadPDF";
import Flashcards from "../pages/Flashcards";
import History from "../pages/History";
import Premium from "../pages/Premium";
import Profile from "../pages/Profile";
>>>>>>> f4b8662 (freeing up the stash to pull rohan's code and work on some pages routed in the slidebar)

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
<<<<<<< HEAD
=======
        <Route path="/upload" element={<UploadPDF />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/history" element={<History />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/profile" element={<Profile />} />
>>>>>>> f4b8662 (freeing up the stash to pull rohan's code and work on some pages routed in the slidebar)
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;