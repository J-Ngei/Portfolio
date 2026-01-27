import React from 'react';
import { Lightbulb, TreePine, Cog, Filter, Target, Rocket } from 'lucide-react';

const iconMap = {
  lightbulb: Lightbulb,
  tree: TreePine,
  cogs: Cog,
  filter: Filter,
  target: Target,
  rocket: Rocket
};

const colorThemes = {
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100',
  green: 'bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-100',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-900 dark:text-purple-100',
  orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100',
  teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-900 dark:text-teal-100',
  rose: 'bg-rose-50 dark:bg-rose-900/30 text-rose-900 dark:text-rose-100'
};

const KeyLearningsGrid = ({ data }) => {
  if (!data || !data.learnings) return null;

  const gridCols = data.layout === '2' ? 'md:grid-cols-2' :
                   data.layout === '3' ? 'md:grid-cols-3' :
                   'md:grid-cols-4';

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.sectionTitle || 'Key Learnings'}
      </h2>
      <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
        {data.learnings.map((learning, idx) => {
          const IconComponent = iconMap[learning.icon] || Lightbulb;
          const colorClass = colorThemes[learning.colorTheme] || colorThemes.blue;

          return (
            <div key={idx} className={`${colorClass} rounded-lg p-6`}>
              <IconComponent className="w-6 h-6 mb-3" />
              <h3 className="font-semibold text-lg mb-3">
                {learning.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {learning.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KeyLearningsGrid;