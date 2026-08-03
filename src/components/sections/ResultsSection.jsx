import React from 'react';

const ResultsSection = ({ data, imageUrlBuilder }) => {
  if (!data) return null;

  const renderTable = () => {
    if (!data.table || !data.table.rows) return null;

    const columns = Array.isArray(data.table.columns) ? data.table.columns : [];
    const headers = Array.isArray(data.table.headers) ? data.table.headers : [];
    const rows = Array.isArray(data.table.rows) ? data.table.rows : [];

    const hasValue = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    };

    const normalizeColumnLabel = (column) => {
      if (typeof column === 'string') return column;
      if (column && typeof column === 'object') return column.title || column.header || '';
      return '';
    };

    let columnLabels = columns.length > 0 ? columns.map(normalizeColumnLabel) : headers;
    let rowValues = [];

    const rowsUseCells = rows.some((row) => Array.isArray(row?.cells));

    if (rowsUseCells) {
      rowValues = rows.map((row) => (Array.isArray(row?.cells) ? row.cells : []));
    } else {
      const getColumnIndex = (colKey) => {
        const match = /^col(\d+)$/i.exec(colKey);
        if (!match) return null;
        return Number(match[1]) - 1;
      };

      const allColumnKeys = rows.length > 0
        ? Array.from(
            new Set(
              rows
                .filter((row) => row && typeof row === 'object')
                .flatMap((row) => Object.keys(row).filter((key) => key.startsWith('col')))
            )
          )
        : [];

      const sortedColumnKeys = allColumnKeys.sort((a, b) => {
        const aIndex = getColumnIndex(a);
        const bIndex = getColumnIndex(b);
        if (aIndex === null || bIndex === null) return a.localeCompare(b);
        return aIndex - bIndex;
      });

      rowValues = rows.map((row) => sortedColumnKeys.map((colKey) => row?.[colKey]));

      if (columnLabels.length === 0 && sortedColumnKeys.length > 0) {
        columnLabels = sortedColumnKeys.map((_, idx) => `Column ${idx + 1}`);
      }
    }

    const columnCount = Math.max(
      columnLabels.length,
      ...rowValues.map((row) => row.length),
      0
    );

    if (columnCount === 0) return null;

    const activeColumnIndices = Array.from({ length: columnCount }, (_, idx) => idx).filter(
      (idx) => rowValues.some((row) => hasValue(row?.[idx]))
    );

    const displayRows = rowValues.filter((row) =>
      activeColumnIndices.some((idx) => hasValue(row?.[idx]))
    );

    if (activeColumnIndices.length === 0 || displayRows.length === 0) {
      return null;
    }

    const displayHeaders = activeColumnIndices.map((idx) => {
      const headerValue = columnLabels[idx];
      return hasValue(headerValue) ? headerValue : '';
    });

    const hasHeaderValues = displayHeaders.some((header) => hasValue(header));

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden overflow-x-auto">
        <table className="w-full min-w-max">
          {hasHeaderValues && (
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {displayHeaders.map((header, idx) => (
                  <th
                    key={`header-${idx}`}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayRows.map((row, rowIdx) => (
                <tr key={`row-${rowIdx}`}>
                  {activeColumnIndices.map((colIdx) => {
                    const cellValue = row?.[colIdx];
                    return (
                      <td
                        key={`cell-${rowIdx}-${colIdx}`}
                        className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap"
                    >
                      {hasValue(cellValue) ? cellValue : ''}
                    </td>
                  );
                })}
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
