import React from 'react';
import { 
  Database, BarChart3, Zap, Target, Settings, 
  Monitor, Search, Smartphone 
} from 'lucide-react';

const iconMap = {
  database: Database,
  chart: BarChart3,
  zap: Zap,
  target: Target,
  settings: Settings,
  monitor: Monitor,
  search: Search,
  smartphone: Smartphone
};

const colorThemes = {
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
  green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
  purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
  teal: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
  rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
};

const SolutionCards = ({ data }) => {
  if (!data || !data.cards) return null;

  const gridCols = data.layout === '2' ? 'md:grid-cols-2' :
                   data.layout === '3' ? 'md:grid-cols-3' :
                   'md:grid-cols-4';

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.sectionTitle || 'The Solution'}
      </h2>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {data.cards.map((card, idx) => {
          const IconComponent = iconMap[card.icon] || Target;
          const colorClass = colorThemes[card.colorTheme] || colorThemes.blue;

          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className={`${colorClass} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SolutionCards;