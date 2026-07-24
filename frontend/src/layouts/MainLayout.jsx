import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#020817]">
      <Sidebar />

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;