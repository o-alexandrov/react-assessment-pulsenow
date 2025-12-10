import { formatCurrency, formatPercentage } from "../utils/formatters";

const MoverItem = ({ item }) => {
  const isPositive = item.changePercent >= 0;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="flex justify-between items-center py-3 border-b last:border-0 border-gray-100">
      <div>
        <p className="font-medium text-gray-900">{item.symbol}</p>
        <p className="text-sm text-gray-500">{item.name}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-900">
          {formatCurrency(item.currentPrice)}
        </p>
        <p className={`text-sm ${colorClass}`}>
          {isPositive ? "+" : ""}
          {formatPercentage(item.changePercent)}
        </p>
      </div>
    </div>
  );
};

const TopMovers = ({ gainers, losers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Gainers
        </h3>
        <div className="flex flex-col">
          {gainers?.map((item) => (
            <MoverItem key={item.symbol} item={item} />
          ))}
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Losers</h3>
        <div className="flex flex-col">
          {losers?.map((item) => (
            <MoverItem key={item.symbol} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopMovers;
