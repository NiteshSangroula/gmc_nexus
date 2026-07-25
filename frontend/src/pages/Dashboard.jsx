import MainLayout from "../layouts/MainLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCards from "../components/dashboard/StatCards";
import HowItWorks from "../components/dashboard/HowItWorks";
import PublicDecks from "../components/dashboard/PublicDecks";
import RecentActivity from "../components/dashboard/RecentActivity";
import RecentUploads from "../components/dashboard/RecentUploads";
import PremiumCard from "../components/dashboard/PremiumCard";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        {/* Top Hero Welcome Banner */}
        <WelcomeBanner />

        {/* 4 Stat Metric Cards */}
        <StatCards />

        {/* Main Content Grid (Left main column vs Right stats column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column (8 Spans) */}
          <div className="space-y-6 lg:col-span-8">
            {/* How it works 5 step stepper */}
            <HowItWorks />

            {/* Public Decks List */}
            <PublicDecks />
          </div>

          {/* Right Column (4 Spans) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Recent Activity List */}
            <RecentActivity />

            {/* Premium Upgrade Plan Card */}
            <PremiumCard />

            {/* Recent Uploads List */}
            <RecentUploads />
          </div>
        </div>

        {/* Footer info bar */}
        <footer className="mt-12 text-center border-t border-slate-200 dark:border-white/10 pt-6 text-xs text-slate-400 dark:text-slate-500">
          <p>GMC Vertex Hackathon Project &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </MainLayout>
  );
};

export default Dashboard;