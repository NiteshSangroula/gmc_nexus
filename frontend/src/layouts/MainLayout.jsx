<<<<<<< HEAD
import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex bg-[#020817]">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
=======
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        {children}
      </div>
>>>>>>> f4b8662 (freeing up the stash to pull rohan's code and work on some pages routed in the slidebar)
    </div>
  );
};

export default MainLayout;