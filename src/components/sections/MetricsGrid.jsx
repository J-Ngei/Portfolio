import React from 'react';

const colorClasses = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-green-600 dark:text-green-400',
  orange: 'text-orange-600 dark:text-orange-400',
  red: 'text-red-600 dark:text-red-400',
  teal: 'text-teal-600 dark:text-teal-400'
};

const MetricsGrid = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  const gridCols = metrics.length <= 2 ? 'md:grid-cols-2' :
                   metrics.length <= 3 ? 'md:grid-cols-3' :
                   'md:grid-cols-4';

  return (
    <div className="max-w-6xl mx-auto px-6 -mt-16">
      <div className={`grid grid-cols-1 ${gridCols} gap-6 mb-12`}>
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-center">
            <div className={`text-4xl font-bold ${colorClasses[metric.color] || colorClasses.blue} mb-2`}>
              {metric.value}
            </div>
            <div className="text-gray-600 dark:text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsGrid;