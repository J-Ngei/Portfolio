import React, { useState, useEffect } from 'react';
import { PortableText } from '@portabletext/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import your existing performance sections
import HeroSection from '../sections/HeroSection';
import MetricsGrid from '../sections/MetricsGrid';
import ProblemSection from '../sections/ProblemSection';
import SolutionCards from '../sections/SolutionCards';
import ResultsSection from '../sections/ResultsSection';
import KeyLearningsGrid from '../sections/KeyLearningsGrid';
import CodeHighlight from '../sections/CodeHighlight';

const PerformanceTemplate = ({ 
  data, 
  imageUrlBuilder, 
  portableTextComponents,
  currentImageIndex,
  setCurrentImageIndex
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  
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

  // Build sections array based on available data
  const sections = [];

  // Section 1: Hero + Metrics
  if (template.hero || template.metrics) {
    sections.push({
      id: 'hero-metrics',
      title: 'Overview',
      render: () => (
        <div className="min-h-screen flex flex-col">
          {template.hero && <HeroSection data={template.hero} />}
          {template.metrics && template.metrics.length > 0 && (
            <div className="mt-8">
              <MetricsGrid metrics={template.metrics} />
            </div>
          )}
        </div>
      )
    });
  }

  // Section 2: Project Overview
  if (template.overview && template.overview.length > 0) {
    sections.push({
      id: 'overview',
      title: 'Project Overview',
      render: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Project Overview
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <PortableText 
                  value={template.overview} 
                  components={portableTextComponents} 
                />
              </div>
            </div>
          </div>
        </div>
      )
    });
  }

  // Section 3: Problem
  if (template.problem) {
    sections.push({
      id: 'problem',
      title: 'The Problem',
      render: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <ProblemSection data={template.problem} />
          </div>
        </div>
      )
    });
  }

  // Section 4: Solution
  if (template.solution) {
    sections.push({
      id: 'solution',
      title: 'The Solution',
      render: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <SolutionCards data={template.solution} />
          </div>
        </div>
      )
    });
  }

  // Section 5: Results
  if (template.results) {
    sections.push({
      id: 'results',
      title: 'Results',
      render: () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <ResultsSection 
              data={template.results} 
              imageUrlBuilder={imageUrlBuilder} 
            />
          </div>
        </div>
      )
    });
  }

  // Section 6: Key Learnings + Code
  if (template.keyLearnings || (template.codeHighlight && template.codeHighlight.code)) {
    sections.push({
      id: 'learnings-code',
      title: 'Key Learnings',
      render: () => (
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {template.keyLearnings && <KeyLearningsGrid data={template.keyLearnings} />}
            {template.codeHighlight && template.codeHighlight.code && (
              <div className="mt-12">
                <CodeHighlight data={template.codeHighlight} />
              </div>
            )}
          </div>
        </div>
      )
    });
  }

  // Reset to first section when data changes
  useEffect(() => {
    setCurrentSection(0);
  }, [data]);

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const goToPrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No sections available</p>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
      {/* Current Section Content */}
      <div className="flex-1 overflow-y-auto">
        {currentSectionData.render()}
      </div>

      {/* Navigation Footer - Only show if multiple sections */}
      {sections.length > 1 && (
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={goToPrevSection}
              disabled={currentSection === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentSection === 0
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Section Indicators */}
            <div className="flex items-center gap-2">
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(idx)}
                  className={`transition-all ${
                    idx === currentSection
                      ? 'w-6 h-2 bg-teal-600 rounded-full'
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 rounded-full'
                  }`}
                  aria-label={`Go to ${section.title}`}
                  title={section.title}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextSection}
              disabled={currentSection === sections.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentSection === sections.length - 1
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Section Title Indicator */}
          <div className="text-center mt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentSection + 1} of {sections.length}: {currentSectionData.title}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceTemplate;