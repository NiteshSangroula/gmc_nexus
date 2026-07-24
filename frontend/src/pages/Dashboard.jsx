import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold text-white">
        Dashboard
      </h1>

      <p className="mt-4 text-gray-400">
        Welcome to FlashMind.
      </p>
    </MainLayout>
  );
};

export default Dashboard;