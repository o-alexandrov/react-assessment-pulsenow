import { formatCurrency, formatPercentage } from "../utils/formatters";

const PortfolioSummary = ({ data }) => {
  if (!data) return null;

  const isPositive = data.totalChange >= 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
        Total Portfolio Value
      </h2>
      <div className="mt-2 flex items-baseline">
        <span className="text-4xl font-extrabold tracking-tight text-gray-900">
          {formatCurrency(data.totalValue)}
        </span>
      </div>
      <div className="mt-2 flex items-center text-sm">
        <span className={`font-medium ${colorClass}`}>
          {isPositive ? "+" : ""}
          {formatCurrency(data.totalChange)} (
          {formatPercentage(data.totalChangePercent)})
        </span>
        <span className="text-gray-500 ml-2">past 24h</span>
      </div>
    </div>
  );
};

export default PortfolioSummary;
