import { useState, useEffect } from "react";
import { getDashboard, getPortfolio } from "../services/api";
import PortfolioSummary from "../components/PortfolioSummary";
import TopMovers from "../components/TopMovers";
import NewsFeed from "../components/NewsFeed";
import ActiveAlerts from "../components/ActiveAlerts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardRes, portfolioRes] = await Promise.all([
          getDashboard(),
          getPortfolio(),
        ]);
        console.log("🚀 ~ fetchData ~ dashboardRes:", dashboardRes);
        setDashboardData(dashboardRes.data.data);
        setPortfolioData(portfolioRes.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pulse-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {portfolioData && <PortfolioSummary data={portfolioData} />}

      {dashboardData && (
        <TopMovers
          gainers={dashboardData.topGainers}
          losers={dashboardData.topLosers}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardData && <NewsFeed news={dashboardData.recentNews} />}
        {dashboardData && <ActiveAlerts alerts={dashboardData.activeAlerts} />}
      </div>
    </div>
  );
};

export default Dashboard;
