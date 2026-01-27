import React from 'react';
import { PortableText } from '@portabletext/react';

// Import your existing performance sections
import HeroSection from '../sections/HeroSection';
import MetricsGrid from '../sections/MetricsGrid';
import ProblemSection from '../sections/ProblemSection';
import SolutionCards from '../sections/SolutionCards';
import ResultsSection from '../sections/ResultsSection';
import KeyLearningsGrid from '../sections/KeyLearningsGrid';
import CodeHighlight from '../sections/CodeHighlight';

const PerformanceTemplate = ({ data, imageUrlBuilder, portableTextComponents }) => {
  console.log('🎯 PerformanceTemplate received data:', data);
  console.log('📦 performanceTemplate nested data:', data.performanceTemplate);
  
  const template = data.performanceTemplate;
  
  if (!template) {
    console.warn('⚠️ No performanceTemplate found in data');
    return (
      <div className="max-w-6xl mx-auto p-12 text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            No performance template data available
          </p>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
            This page may need to be configured in your CMS
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ Performance template loaded:', {
    hasHero: !!template.hero,
    hasMetrics: !!template.metrics,
    hasOverview: !!template.overview,
    hasProblem: !!template.problem,
    hasSolution: !!template.solution,
    hasResults: !!template.results,
    hasKeyLearnings: !!template.keyLearnings,
    hasCodeHighlight: !!template.codeHighlight
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {template.hero && (
        <>
          <HeroSection data={template.hero} />
          <div className="h-4"></div>
        </>
      )}
      
      {/* Metrics Grid */}
      {template.metrics && template.metrics.length > 0 && (
        <>
          <MetricsGrid metrics={template.metrics} />
          <div className="h-8"></div>
        </>
      )}
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Overview */}
        {template.overview && template.overview.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Project Overview
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <PortableText 
                  value={template.overview} 
                  components={portableTextComponents} 
                />
              </div>
            </div>
          </section>
        )}

        {/* Problem Section */}
        {template.problem && <ProblemSection data={template.problem} />}

        {/* Solution Cards */}
        {template.solution && <SolutionCards data={template.solution} />}

        {/* Results */}
        {template.results && (
          <ResultsSection 
            data={template.results} 
            imageUrlBuilder={imageUrlBuilder} 
          />
        )}

        {/* Key Learnings */}
        {template.keyLearnings && <KeyLearningsGrid data={template.keyLearnings} />}

        {/* Code Highlight */}
        {template.codeHighlight && template.codeHighlight.code && (
          <CodeHighlight data={template.codeHighlight} />
        )}
      </div>
    </div>
  );
};

export default PerformanceTemplate;