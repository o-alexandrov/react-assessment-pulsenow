import { useState, useEffect } from "react";
import { getPortfolio } from "../services/api";
import { formatCurrency, formatPercentage } from "../utils/formatters";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await getPortfolio();
        setPortfolio(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError("Failed to load portfolio. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const changeColor =
    portfolio?.totalChange >= 0 ? "text-green-600" : "text-red-600";
  const changeBgColor =
    portfolio?.totalChange >= 0 ? "bg-green-50" : "bg-red-50";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Portfolio Overview</h1>

      {/* Portfolio Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Total Value
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(portfolio?.totalValue)}
          </p>
        </div>

        <div className={`${changeBgColor} rounded-lg shadow p-6`}>
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Total Change
          </h3>
          <p className={`text-3xl font-bold ${changeColor}`}>
            {formatCurrency(portfolio?.totalChange)}
          </p>
          <p className={`text-sm font-semibold ${changeColor} mt-1`}>
            {formatPercentage(portfolio?.changePercentage)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Total Assets
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {portfolio?.holdings?.length || 0}
          </p>
        </div>
      </div>

      {/* Asset Allocation */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {portfolio?.assetAllocation && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Stocks</span>
                  <span className="text-gray-900 font-semibold">
                    {portfolio.assetAllocation.stocks.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${portfolio.assetAllocation.stocks}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(
                    (portfolio.totalValue * portfolio.assetAllocation.stocks) /
                      100
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Crypto</span>
                  <span className="text-gray-900 font-semibold">
                    {portfolio.assetAllocation.crypto.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all"
                    style={{ width: `${portfolio.assetAllocation.crypto}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(
                    (portfolio.totalValue * portfolio.assetAllocation.crypto) /
                      100
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  P/L
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio?.holdings?.map((holding) => {
                const profitLoss = holding.currentValue - holding.totalCost;
                const profitLossPercent = (
                  (profitLoss / holding.totalCost) *
                  100
                ).toFixed(2);
                const plColor =
                  profitLoss >= 0 ? "text-green-600" : "text-red-600";

                return (
                  <tr key={holding.symbol} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {holding.symbol}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {holding.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          holding.type === "stock"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {holding.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {holding.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(holding.averageCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {formatCurrency(holding.currentPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {formatCurrency(holding.currentValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className={`font-semibold ${plColor}`}>
                        {formatCurrency(profitLoss)}
                      </div>
                      <div className={`text-xs ${plColor}`}>
                        ({profitLossPercent}%)
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      {portfolio?.performanceMetrics && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Best Performer
            </h3>
            <p className="text-xl font-bold text-gray-900">
              {portfolio.performanceMetrics.bestPerformer?.symbol}
            </p>
            <p className="text-sm text-green-600 font-semibold">
              +{portfolio.performanceMetrics.bestPerformer?.change}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Worst Performer
            </h3>
            <p className="text-xl font-bold text-gray-900">
              {portfolio.performanceMetrics.worstPerformer?.symbol}
            </p>
            <p className="text-sm text-red-600 font-semibold">
              {portfolio.performanceMetrics.worstPerformer?.change}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Avg. Return
            </h3>
            <p className="text-xl font-bold text-gray-900">
              {portfolio.performanceMetrics.averageReturn?.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
