import { useState, useEffect } from "react";
import { getAlerts } from "../services/api";
import { formatDateTime } from "../utils/formatters";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const severities = ["all", "critical", "high", "medium", "low"];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const params =
          selectedSeverity !== "all" ? { severity: selectedSeverity } : {};
        const response = await getAlerts(params);
        setAlerts(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [selectedSeverity]);

  const getSeverityStyles = (severity) => {
    const styles = {
      critical: {
        bg: "bg-red-100",
        border: "border-red-300",
        text: "text-red-800",
        badge: "bg-red-600 text-white",
        icon: "text-red-600",
      },
      high: {
        bg: "bg-orange-100",
        border: "border-orange-300",
        text: "text-orange-800",
        badge: "bg-orange-600 text-white",
        icon: "text-orange-600",
      },
      medium: {
        bg: "bg-yellow-100",
        border: "border-yellow-300",
        text: "text-yellow-800",
        badge: "bg-yellow-600 text-white",
        icon: "text-yellow-600",
      },
      low: {
        bg: "bg-blue-100",
        border: "border-blue-300",
        text: "text-blue-800",
        badge: "bg-blue-600 text-white",
        icon: "text-blue-600",
      },
    };
    return styles[severity] || styles.medium;
  };

  const groupedAlerts = severities
    .filter((severity) => severity !== "all")
    .map((severity) => ({
      severity,
      alerts: alerts.filter((alert) => alert.severity === severity),
    }))
    .filter((group) => group.alerts.length > 0);

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
        <h1 className="text-3xl font-bold">Alerts</h1>
        <div className="text-sm text-gray-500">
          {alerts.length} active alert{alerts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Severity Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {severities.map((severity) => (
          <button
            key={severity}
            onClick={() => setSelectedSeverity(severity)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSeverity === severity
                ? "bg-pulse-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      {/* Alerts Display */}
      {alerts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">
            No alerts found for this severity level.
          </p>
        </div>
      ) : selectedSeverity === "all" ? (
        // Grouped by severity
        <div className="space-y-6">
          {groupedAlerts.map((group) => {
            const styles = getSeverityStyles(group.severity);
            return (
              <div key={group.severity}>
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-md text-sm ${styles.badge}`}
                  >
                    {group.severity.toUpperCase()}
                  </span>
                  <span className="text-gray-600 text-base font-normal">
                    ({group.alerts.length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {group.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-r-lg`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              className={`h-5 w-5 ${styles.icon}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className={`font-semibold ${styles.text}`}>
                              {alert.message}
                            </p>
                          </div>
                          {alert.details && (
                            <p className="text-sm text-gray-600 ml-7">
                              {alert.details}
                            </p>
                          )}
                          {alert.relatedAsset && (
                            <div className="flex items-center gap-2 mt-2 ml-7">
                              <span className="text-xs text-gray-500">
                                Related:
                              </span>
                              <span className="text-xs font-medium px-2 py-0.5 bg-white rounded">
                                {alert.relatedAsset}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {formatDateTime(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Single severity view
        <div className="space-y-3">
          {alerts.map((alert) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <div
                key={alert.id}
                className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded-r-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className={`h-5 w-5 ${styles.icon}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className={`font-semibold ${styles.text}`}>
                        {alert.message}
                      </p>
                    </div>
                    {alert.details && (
                      <p className="text-sm text-gray-600 ml-7">
                        {alert.details}
                      </p>
                    )}
                    {alert.relatedAsset && (
                      <div className="flex items-center gap-2 mt-2 ml-7">
                        <span className="text-xs text-gray-500">Related:</span>
                        <span className="text-xs font-medium px-2 py-0.5 bg-white rounded">
                          {alert.relatedAsset}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    {formatDateTime(alert.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
