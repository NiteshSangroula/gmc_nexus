import MainLayout from "../layouts/MainLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import StatCards from "../components/dashboard/StatCards";
import HowItWorks from "../components/dashboard/HowItWorks";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import DailyProgressChart from "../components/dashboard/DailyProgressChart";
import RecentUploads from "../components/dashboard/RecentUploads";
import PremiumCard from "../components/dashboard/PremiumCard";
import { Link } from "react-router-dom";

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

            {/* Split row: Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <RecentActivity />
              <QuickActions />
            </div>
          </div>

          {/* Right Column (4 Spans) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Daily Progress Chart */}
            <DailyProgressChart />

            {/* Premium Upgrade Plan Card */}
            <PremiumCard />

            {/* Recent Uploads List */}
            <RecentUploads />
          </div>
        </div>

        {/* Footer info bar */}
        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 text-xs text-slate-400 dark:text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PDF to Flashcards. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/support" className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>
            <Link to="/support" className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</Link>
            <Link to="/support" className="hover:text-slate-600 dark:hover:text-slate-300">Contact Us</Link>
          </div>
        </footer>
      </div>
    </MainLayout>
  );
};

export default Dashboard;