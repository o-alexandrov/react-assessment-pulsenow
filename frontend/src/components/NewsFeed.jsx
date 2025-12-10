import { formatDateTime } from "../utils/formatters";

const NewsFeed = ({ news }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent News</h3>
      <div className="space-y-4">
        {news?.map((item) => (
          <div
            key={item.id}
            className="border-b last:border-0 border-gray-100 pb-3 last:pb-0"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {item.category}
              </span>
              <span className="text-xs text-gray-500">
                {formatDateTime(item.timestamp)}
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-1 hover:text-pulse-primary cursor-pointer transition-colors">
              {item.title}
            </h4>
            <p className="text-xs text-gray-500">{item.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
