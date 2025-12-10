import { useState, useEffect } from "react";
import { getNews } from "../services/api";
import { formatDateTime } from "../utils/formatters";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "market", "crypto", "technology", "finance"];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory !== "all") {
          // Map frontend categories to backend categories if needed
          if (selectedCategory === "finance") {
            params.category = "earnings";
          } else {
            params.category = selectedCategory;
          }
        }

        const response = await getNews(params);
        setNews(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedCategory]);

  const getCategoryColor = (category) => {
    const colors = {
      market: "bg-blue-100 text-blue-800",
      crypto: "bg-purple-100 text-purple-800",
      technology: "bg-green-100 text-green-800",
      finance: "bg-yellow-100 text-yellow-800",
      earnings: "bg-yellow-100 text-yellow-800", // Map earnings to same yellow
      macro: "bg-orange-100 text-orange-800",
      regulatory: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.default;
  };

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

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Latest News</h1>
        <div className="text-sm text-gray-500">
          {news.length} article{news.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-pulse-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {news.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">
            No news articles found for this category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDateTime(item.timestamp)}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {item.title}
              </h3>

              {item.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{item.source}</span>
                {item.relatedAssets && item.relatedAssets.length > 0 && (
                  <div className="flex gap-1">
                    {item.relatedAssets.slice(0, 2).map((asset, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {asset}
                      </span>
                    ))}
                    {item.relatedAssets.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                        +{item.relatedAssets.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
