const SimpleChart = ({ type = "line" }) => {
  if (type === "pie") {
    return (
      <div className=" p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Application Status
        </h3>
        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Green section (70%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="20"
                strokeDasharray="175.93 251.33"
                strokeDashoffset="0"
              />
              {/* Orange section (30%) */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="20"
                strokeDasharray="75.4 251.33"
                strokeDashoffset="-175.93"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Fabricators</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Marketing Rep</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" p-6 w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Application Trend
      </h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {[40, 65, 45, 80, 60, 90, 75].map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-orange-400 to-orange-200 rounded-t"
              style={{ height: `${height}%` }}
            ></div>
            <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">Days</span>
      </div>
    </div>
  );
};

export default SimpleChart;
