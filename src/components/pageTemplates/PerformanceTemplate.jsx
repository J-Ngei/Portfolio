import React, { useEffect, useRef, useState } from 'react';
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
const MAX_MERMAID_LABEL_CHARS = 18;
const MERMAID_LABEL_PADDING = '\u00A0\u00A0';

const ArchitectureSection = ({ data, imageUrlBuilder }) => {
  const mermaidRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const wrapMermaidLabel = (rawLabel, maxChars) => {
    if (!rawLabel) return rawLabel;
    if (/<br\s*\/?>|\n/.test(rawLabel)) return rawLabel;

    const leading = rawLabel.match(/^\s*/)?.[0] ?? '';
    const trailing = rawLabel.match(/\s*$/)?.[0] ?? '';
    const trimmed = rawLabel.trim();
    if (!trimmed) return rawLabel;

    const hasQuote =
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"));
    const quote = hasQuote ? trimmed[0] : '';
    const inner = hasQuote ? trimmed.slice(1, -1) : trimmed;

    const padLine = (line) => `${MERMAID_LABEL_PADDING}${line}${MERMAID_LABEL_PADDING}`;
    if (inner.length <= maxChars) {
      const padded = padLine(inner);
      return `${leading}${quote}${padded}${quote}${trailing}`;
    }

    const words = inner.split(/\s+/);
    const lines = [];
    let current = '';

    words.forEach((word) => {
      if (!word) return;
      if (!current) {
        current = word;
        return;
      }
      const next = `${current} ${word}`;
      if (next.length <= maxChars) {
        current = next;
      } else {
        lines.push(current);
        current = word;
      }
    });

    if (current) lines.push(current);

    const wrapped = lines.map(padLine).join('\n');
    return `${leading}${quote}${wrapped}${quote}${trailing}`;
  };

  const wrapMermaidCode = (code, maxChars) => {
    if (!code) return code;
    const nodeId = '[A-Za-z0-9_:-]+';
    const patterns = [
      new RegExp(`\\b(${nodeId})\\s*(\\[\\[)([^\\]]+?)(\\]\\])`, 'g'),
      new RegExp(`\\b(${nodeId})\\s*(\\(\\()([^\\)]+?)(\\)\\))`, 'g'),
      new RegExp(`\\b(${nodeId})\\s*(\\{\\{)([^\\}]+?)(\\}\\})`, 'g'),
      new RegExp(`\\b(${nodeId})\\s*(\\[)([^\\]]+?)(\\])`, 'g'),
      new RegExp(`\\b(${nodeId})\\s*(\\()([^\\)]+?)(\\))`, 'g'),
      new RegExp(`\\b(${nodeId})\\s*(\\{)([^\\}]+?)(\\})`, 'g'),
    ];

    return patterns.reduce(
      (acc, pattern) =>
        acc.replace(pattern, (match, id, open, label, close) => {
          const wrapped = wrapMermaidLabel(label, maxChars);
          return `${id}${open}${wrapped}${close}`;
        }),
      code
    );
  };

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Load Mermaid only if needed
    if (data?.diagramType === 'mermaid' && data?.mermaidCode) {
      const renderMermaid = () => {
        if (!window.mermaid || !mermaidRef.current) return;
        mermaidRef.current.removeAttribute('data-processed');
        mermaidRef.current.innerHTML = wrapMermaidCode(
          data.mermaidCode,
          MAX_MERMAID_LABEL_CHARS
        );
        window.mermaid.contentLoaded();
      };

      const initializeMermaid = () => {
        if (!window.mermaid) return;
        window.mermaid.initialize({
          startOnLoad: true,
          theme: isDarkMode ? 'dark' : 'default',
          securityLevel: 'loose',
          flowchart: {
            htmlLabels: false,
            useMaxWidth: false,
          },
          themeVariables: {
            fontFamily: 'inherit',
            fontSize: '14px',
            ...(isDarkMode
              ? {
                  lineColor: '#e2e8f0',
                  textColor: '#e2e8f0',
                  primaryTextColor: '#e2e8f0',
                  secondaryTextColor: '#e2e8f0',
                }
              : {}),
          },
        });

        renderMermaid();

        if (document.fonts?.ready) {
          document.fonts.ready.then(() => {
            renderMermaid();
          });
        }
      };

      if (window.mermaid) {
        initializeMermaid();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.async = true;

      script.onload = () => {
        initializeMermaid();
      };

      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [data?.diagramType, data?.mermaidCode, isDarkMode]);

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
            <div className="mx-auto w-full max-w-[820px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
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
            <div className="mx-auto w-full max-w-[900px]">
              <div 
                ref={mermaidRef}
                className="mermaid flex justify-center"
              >
                {data.mermaidCode}
              </div>
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
