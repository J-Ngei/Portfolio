import React from 'react';

const colorThemes = {
  'blue-purple': 'from-blue-600 to-purple-600',
  'green-teal': 'from-green-600 to-teal-600',
  'orange-red': 'from-orange-600 to-red-600',
  'indigo-violet': 'from-indigo-600 to-violet-600',
  'rose-pink': 'from-rose-600 to-pink-600',
  'slate-gray': 'from-slate-600 to-gray-600'
};

const HeroSection = ({ data }) => {
  const gradientClass = colorThemes[data.colorTheme] || colorThemes['blue-purple'];

  return (
    <div className={`bg-gradient-to-r ${gradientClass} text-white`}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {data.tags.map((tag, idx) => (
              <span key={idx} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="text-5xl font-bold mb-4">
          {data.title}
        </h1>
        
        {data.subtitle && (
          <p className="text-xl mb-8 text-blue-100">
            {data.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroSection;