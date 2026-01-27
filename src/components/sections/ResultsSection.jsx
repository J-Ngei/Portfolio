import React from 'react';

const ResultsSection = ({ data, imageUrlBuilder }) => {
  if (!data) return null;

  const renderTable = () => {
    if (!data.table || !data.table.rows) return null;

    const headers = data.table.headers || [];
    const rows = data.table.rows || [];

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {headers.map((header, idx) => (
                <th 
                  key={idx} 
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {Object.values(row)
                  .filter(val => typeof val === 'string') // Filter out _type and _key
                  .map((cell, cellIdx) => (
                    <td 
                      key={cellIdx} 
                      className="px-6 py-4 text-gray-900 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderImages = () => {
    if (!data.resultImages || data.resultImages.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.resultImages.map((image, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <img 
              src={imageUrlBuilder(image)} 
              alt={image.alt || 'Result'} 
              className="w-full h-auto"
            />
            {image.caption && (
              <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.sectionTitle || 'Results'}
      </h2>
      
      {data.displayType === 'table' && renderTable()}
      {data.displayType === 'image' && renderImages()}
      {data.displayType === 'both' && (
        <>
          {renderTable()}
          <div className="mt-8">
            {renderImages()}
          </div>
        </>
      )}
    </section>
  );
};

export default ResultsSection;