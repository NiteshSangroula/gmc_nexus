import Sidebar from "../components/layout/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white lg:flex">
      <Sidebar />

      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;