import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeHighlight = ({ data }) => {
  if (!data || !data.code) return null;

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.sectionTitle || 'Code Highlight'}
      </h2>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
        <SyntaxHighlighter
          language={data.language || 'python'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5'
          }}
          showLineNumbers
        >
          {data.code}
        </SyntaxHighlighter>
      </div>
    </section>
  );
};

export default CodeHighlight;