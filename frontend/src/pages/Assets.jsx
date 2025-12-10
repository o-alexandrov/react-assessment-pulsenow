import { useState, useEffect, useMemo } from "react";
import { getStocks, getCrypto } from "../services/api";
import AssetsTable from "../components/AssetsTable";

const Assets = () => {
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'stock', 'crypto'

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const [stocksRes, cryptoRes] = await Promise.all([
          getStocks(),
          getCrypto(),
        ]);

        // Normalize and combine data
        const stocks = stocksRes.data.map((item) => ({
          ...item,
          type: "stock",
        }));
        const crypto = cryptoRes.data.map((item) => ({
          ...item,
          type: "crypto",
        }));

        setAllAssets([...stocks, ...crypto]);
        setError(null);
      } catch (err) {
        console.error("Error fetching assets:", err);
        setError("Failed to load assets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    if (filter === "all") return allAssets;
    return allAssets.filter((asset) => asset.type === filter);
  }, [allAssets, filter]);

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
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          Assets
        </h1>

        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${
              filter === "all"
                ? "bg-gray-100 text-blue-700"
                : "bg-white text-gray-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("stock")}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${
              filter === "stock"
                ? "bg-gray-100 text-blue-700"
                : "bg-white text-gray-900"
            }`}
          >
            Stocks
          </button>
          <button
            type="button"
            onClick={() => setFilter("crypto")}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 ${
              filter === "crypto"
                ? "bg-gray-100 text-blue-700"
                : "bg-white text-gray-900"
            }`}
          >
            Crypto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <AssetsTable assets={filteredAssets} />
      </div>
    </div>
  );
};

export default Assets;
