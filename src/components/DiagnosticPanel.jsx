import React, { useState } from 'react';

/**
 * Diagnostic Panel - Shows the exact data structure being passed to templates
 * Use this temporarily to debug data structure issues
 */
const DiagnosticPanel = ({ data, pageType }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium"
      >
        {isExpanded ? 'Hide' : 'Show'} Debug Data
      </button>

      {isExpanded && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-auto bg-slate-900 text-white p-4 rounded-lg shadow-2xl">
          <h3 className="font-bold text-lg mb-2 text-purple-400">Page Data Structure</h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-400">Page Type:</span>{' '}
              <span className="text-green-400 font-mono">{pageType}</span>
            </div>

            <div className="border-t border-gray-700 pt-2 mt-2">
              <div className="text-gray-400 mb-1">Available Fields:</div>
              <ul className="list-disc list-inside space-y-1">
                {Object.keys(data).map(key => (
                  <li key={key} className="text-blue-300 font-mono">
                    {key}
                    {data[key] !== null && data[key] !== undefined && (
                      <span className="text-gray-500 ml-2">
                        ({Array.isArray(data[key]) ? `Array[${data[key].length}]` : typeof data[key]})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {pageType === 'performance' && (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="text-gray-400 mb-1">Performance Template:</div>
                {data.performanceTemplate ? (
                  <ul className="list-disc list-inside space-y-1">
                    {Object.keys(data.performanceTemplate).map(key => (
                      <li key={key} className="text-yellow-300 font-mono text-xs">
                        {key}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-red-400">❌ Not found!</div>
                )}
              </div>
            )}

            {pageType === 'technical' && (
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="text-gray-400 mb-1">Technical Template:</div>
                {data.technicalTemplate ? (
                  <ul className="list-disc list-inside space-y-1">
                    {Object.keys(data.technicalTemplate).map(key => (
                      <li key={key} className="text-yellow-300 font-mono text-xs">
                        {key}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-red-400">❌ Not found!</div>
                )}
              </div>
            )}

            <div className="border-t border-gray-700 pt-2 mt-2">
              <details>
                <summary className="cursor-pointer text-gray-400 hover:text-white">
                  Full JSON Data
                </summary>
                <pre className="text-xs mt-2 overflow-auto bg-black p-2 rounded">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticPanel;