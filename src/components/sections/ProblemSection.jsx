import React from 'react';

const themeColors = {
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-500',
    title: 'text-red-900 dark:text-red-100',
    text: 'text-gray-700 dark:text-gray-300'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-500',
    title: 'text-orange-900 dark:text-orange-100',
    text: 'text-gray-700 dark:text-gray-300'
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-500',
    title: 'text-yellow-900 dark:text-yellow-100',
    text: 'text-gray-700 dark:text-gray-300'
  }
};

const ProblemSection = ({ data }) => {
  if (!data) return null;
  
  const theme = themeColors[data.theme] || themeColors.red;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.title || 'The Problem'}
      </h2>
      <div className={`${theme.bg} border-l-4 ${theme.border} p-6 rounded-r-lg`}>
        <h3 className={`text-xl font-semibold ${theme.title} mb-3`}>
          {data.description}
        </h3>
        {data.points && data.points.length > 0 && (
          <ul className={`list-disc list-inside ${theme.text} space-y-2`}>
            {data.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ProblemSection;