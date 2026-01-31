import React, { useEffect, useRef } from 'react';
import { PortableText } from '@portabletext/react';
import { Github, ExternalLink, ArrowLeft } from 'lucide-react';

// Import your existing performance sections
import HeroSection from '../sections/HeroSection';
import MetricsGrid from '../sections/MetricsGrid';
import ProblemSection from '../sections/ProblemSection';
import SolutionCards from '../sections/SolutionCards';
import ResultsSection from '../sections/ResultsSection';
import KeyLearningsGrid from '../sections/KeyLearningsGrid';
import CodeHighlight from '../sections/CodeHighlight';

// Architecture Section Component
const ArchitectureSection = ({ data, imageUrlBuilder }) => {
  const mermaidRef = useRef(null);

  useEffect(() => {
    // Load Mermaid only if needed
    if (data?.diagramType === 'mermaid' && data?.mermaidCode) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.async = true;
      
      script.onload = () => {
        if (window.mermaid) {
          window.mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose'
          });
          
          if (mermaidRef.current) {
            window.mermaid.contentLoaded();
          }
        }
      };
      
      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [data?.diagramType, data?.mermaidCode]);

  if (!data || (!data.image && !data.mermaidCode)) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {data.sectionTitle || 'System Architecture'}
      </h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Image Diagram */}
        {data.diagramType === 'image' && data.image && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={imageUrlBuilder(data.image)}
                alt={data.image.alt || 'Architecture diagram'}
                className="w-full h-auto"
              />
            </div>
            {data.image.caption && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center italic">
                {data.image.caption}
              </p>
            )}
          </div>
        )}

        {/* Mermaid Diagram */}
        {data.diagramType === 'mermaid' && data.mermaidCode && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <div 
              ref={mermaidRef}
              className="mermaid flex justify-center"
            >
              {data.mermaidCode}
            </div>
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.description}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

// Project Links Component
const ProjectLinks = ({ githubUrl, demoUrl, onBackClick }) => {
  const hasAnyLink = githubUrl || demoUrl;
  
  if (!hasAnyLink && !onBackClick) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Back to Projects */}
        <button
          onClick={onBackClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All Projects
        </button>

        {/* GitHub Link */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            <Github className="w-4 h-4" />
            View Code
          </a>
        )}

        {/* Demo Link */}
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        )}
      </div>
    </section>
  );
};

const PerformanceTemplate = ({ data, imageUrlBuilder, portableTextComponents, onClose }) => {
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
    hasArchitecture: !!template.architecture,
    hasProblem: !!template.problem,
    hasSolution: !!template.solution,
    hasResults: !!template.results,
    hasKeyLearnings: !!template.keyLearnings,
    hasCodeHighlight: !!template.codeHighlight,
    hasProjectLinks: !!template.projectLinks
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

        {/* Architecture Section - NEW */}
        {template.architecture && (
          <ArchitectureSection 
            data={template.architecture} 
            imageUrlBuilder={imageUrlBuilder} 
          />
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

        {/* Project Links - NEW */}
        {(template.projectLinks || onClose) && (
          <ProjectLinks 
            githubUrl={template.projectLinks?.githubUrl}
            demoUrl={template.projectLinks?.demoUrl}
            onBackClick={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default PerformanceTemplate;