import { formatDateTime } from "../utils/formatters";

const severityConfig = {
  high: { bg: "bg-red-100", text: "text-red-800" },
  medium: { bg: "bg-yellow-100", text: "text-yellow-800" },
  low: { bg: "bg-green-100", text: "text-green-800" },
};

const ActiveAlerts = ({ alerts }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Active Alerts
      </h3>
      <div className="space-y-4">
        {alerts?.map((alert) => {
          const config = severityConfig[alert.severity] || severityConfig.low;
          return (
            <div
              key={alert.id}
              className="flex items-start space-x-3 border-b last:border-0 border-gray-100 pb-3 last:pb-0"
            >
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${config.bg} ${config.text}`}
              >
                {alert.severity}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatDateTime(alert.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveAlerts;
