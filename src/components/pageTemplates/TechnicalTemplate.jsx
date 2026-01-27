import React from 'react';
import { PortableText } from '@portabletext/react';
import ImageSection from '../sections/ImageSection';

const TechnicalTemplate = ({ data, imageUrlBuilder, portableTextComponents }) => {
  const template = data.technicalTemplate;
  
  if (!template) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center">
        <p className="text-gray-500">No technical template data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {template.title && (
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">
            {template.title}
          </h1>
        )}

        {template.sections && template.sections.map((section, idx) => {
          // Text Section
          if (section._type === 'textSection') {
            return (
              <section key={idx} className="mb-12">
                {section.title && (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {section.title}
                  </h2>
                )}
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <PortableText 
                    value={section.content} 
                    components={portableTextComponents} 
                  />
                </div>
              </section>
            );
          }

          // Image Section
          if (section._type === 'imageSection') {
            return (
              <ImageSection
                key={idx}
                image={section.image}
                size={section.size}
                imageUrlBuilder={imageUrlBuilder}
              />
            );
          }

          // Diagram Section
          if (section._type === 'diagramSection') {
            return (
              <section key={idx} className="mb-12">
                {section.title && (
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {section.title}
                  </h2>
                )}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
                  <img 
                    src={imageUrlBuilder(section.diagram)} 
                    alt={section.diagram.alt || 'Architecture diagram'} 
                    className="w-full h-auto"
                  />
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default TechnicalTemplate;