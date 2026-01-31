import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { PortableText } from '@portabletext/react';

// Import page templates
import PerformanceTemplate from "./pageTemplates/PerformanceTemplate";
import TechnicalTemplate from './pageTemplates/TechnicalTemplate';
import GalleryTemplate from './pageTemplates/GalleryTemplate';
import StandardTemplate from './pageTemplates/StandardTemplate';
//import DiagnosticPanel from './DiagnosticPanel';

// Helper function to build image URLs
const imageUrlBuilder = (source) => {
  if (!source?.asset) return '/api/placeholder/400/300';
  
  if (source.asset.url) {
    return source.asset.url;
  }
  
  if (source.asset._ref) {
    const ref = source.asset._ref;
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
    const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }

  return '/api/placeholder/400/300';
};

// Template mapping
const pageTemplates = {
  performance: PerformanceTemplate,
  technical: TechnicalTemplate,
  gallery: GalleryTemplate,
  standard: StandardTemplate
};

// Portable Text components for standard pages
const portableTextComponents = {
  block: {
    h1: ({children}) => <h1 className="text-3xl font-bold my-4 text-slate-800 dark:text-white">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-bold my-3 text-slate-800 dark:text-white">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold my-2 text-slate-800 dark:text-white">{children}</h3>,
    normal: ({children}) => <p className="my-4 text-slate-700 dark:text-gray-300 leading-relaxed">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-teal-500 pl-4 italic my-4 text-slate-700 dark:text-gray-300 bg-amber-50/50 dark:bg-slate-800/50 py-2 rounded-r">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 my-4 text-slate-700 dark:text-gray-300">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 my-4 text-slate-700 dark:text-gray-300">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="mb-2 text-slate-700 dark:text-gray-300">{children}</li>,
    number: ({children}) => <li className="mb-2 text-slate-700 dark:text-gray-300">{children}</li>,
  },
  marks: {
    link: ({value, children}) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a href={value?.href} target={target} className="text-teal-600 dark:text-teal-400 hover:underline">
          {children}
        </a>
      );
    },
  },
};

// Image Display Component with loading states
const ImageDisplay = ({ image, alt, className = '', onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
        </div>
      )}
      
      {isError ? (
        <div className="text-center p-8 text-slate-500">
          <p>Failed to load image</p>
        </div>
      ) : (
        <img
          src={imageUrlBuilder(image)}
          alt={alt || 'Project image'}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

const ProjectViewer = ({ project, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [pages, setPages] = useState([]);
  //const [showDiagnostics, setShowDiagnostics] = useState(true); // Set to false in production
  const contentRef = useRef(null);

  // Initialize pages from project data
  useEffect(() => {
    console.log('🔍 ProjectViewer received project:', project);
    console.log('📄 Project pages:', project.pages);
    
    const processPage = (page, index) => {
      console.log(`Processing page ${index}:`, page);
      console.log(`Page type: ${page.pageType}`);
      
      // Return page as-is - templates will handle their own data structure
      return {
        ...page,
        pageType: page.pageType || 'standard',
        content: page.content || [],
        images: page.images || (page.coverImage ? [page.coverImage] : [])
      };
    };

    if (project.pages?.length > 0) {
      const processedPages = project.pages.map(processPage);
      console.log('✅ Processed pages:', processedPages);
      setPages(processedPages);
    } else {
      console.log('⚠️ No pages found, creating fallback page');
      // Fallback for legacy projects
      setPages([processPage({
        pageType: 'standard',
        title: project.title || 'Project Overview',
        content: project.content || [],
        images: project.coverImage ? [project.coverImage] : []
      }, 0)]);
    }
    
    setCurrentPage(0);
    setCurrentImageIndex(0);
  }, [project]);

  // Reset image index when page changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentPage]);

  const currentPageData = pages[currentPage] || {};
  const pageType = currentPageData?.pageType || 'standard';
  
  console.log('📍 Current page:', currentPage);
  console.log('📄 Current page data:', currentPageData);
  console.log('🎨 Page type:', pageType);
  
  // Get the appropriate template component
  const TemplateComponent = pageTemplates[pageType] || StandardTemplate;
  console.log('🧩 Template component:', TemplateComponent?.name || 'StandardTemplate');

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      setCurrentImageIndex(0);
      contentRef.current?.scrollTo(0, 0);
    }
  }, [currentPage, pages.length]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setCurrentImageIndex(0);
      contentRef.current?.scrollTo(0, 0);
    }
  }, [currentPage]);

  const toggleFullscreen = useCallback((image = null) => {
    if (image) {
      setFullscreenImage(image);
      setIsFullscreen(true);
    } else if (isFullscreen) {
      setIsFullscreen(false);
      setFullscreenImage(null);
    } else {
      // Default to current image from standard/gallery templates
      const images = currentPageData.images;
      if (images && images[currentImageIndex]) {
        setFullscreenImage(images[currentImageIndex]);
        setIsFullscreen(true);
      }
    }
  }, [isFullscreen, currentPageData, currentImageIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isFullscreen) {
        setIsFullscreen(false);
        setFullscreenImage(null);
      }
      return;
    }
  }, [isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentPageData || pages.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-teal-50 z-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="animate-spin h-12 w-12 text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-50 flex flex-col">
      {/* Header - Always visible */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{project.title}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Page {currentPage + 1} of {pages.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-900 dark:to-slate-800">
        <div className="h-full overflow-y-auto" ref={contentRef}>
          <div className="min-h-full">
            <TemplateComponent 
              data={currentPageData}
              imageUrlBuilder={imageUrlBuilder}
              portableTextComponents={portableTextComponents}
              ImageDisplay={ImageDisplay}
              toggleFullscreen={toggleFullscreen}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              onClose={onClose}
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation - Always visible when multiple pages */}
      {pages.length > 1 && (
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentPage === 0
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex gap-1.5">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentPage(idx);
                    contentRef.current?.scrollTo(0, 0);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? 'bg-teal-600 w-6'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === pages.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentPage === pages.length - 1
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {/* Fullscreen Overlay */}
      {isFullscreen && fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => {
            setIsFullscreen(false);
            setFullscreenImage(null);
          }}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={imageUrlBuilder(fullscreenImage)}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
                setFullscreenImage(null);
              }}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Exit fullscreen"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProjectViewer;