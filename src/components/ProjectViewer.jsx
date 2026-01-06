import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Loader2 } from 'lucide-react';
import { PortableText } from '@portabletext/react';

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

// Custom component for two columns
const TwoColumns = ({ value }) => {
  if (!value) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      <div className="prose prose-lg max-w-none">
        {value.leftColumn && <PortableText value={value.leftColumn} components={portableTextComponents} />}
      </div>
      <div className="prose prose-lg max-w-none">
        {value.rightColumn && <PortableText value={value.rightColumn} components={portableTextComponents} />}
      </div>
    </div>
  );
};

// Portable Text components
const portableTextComponents = {
  block: {
    h1: ({children}) => <h1 className="text-3xl font-bold my-4 text-slate-800 dark:text-white">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-bold my-3 text-slate-800 dark:text-white">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold my-2 text-slate-800 dark:text-white">{children}</h3>,
    normal: ({children}) => <p className="my-4 text-slate-700 dark:text-gray-300">{children}</p>,
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
  types: {
    twoColumns: ({ value }) => <TwoColumns value={value} />,
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
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  // Initialize pages from project data
  useEffect(() => {
    if (project.pages?.length > 0) {
      setPages(project.pages);
    } else {
      setPages([{
        title: project.title || 'Project Overview',
        content: project.content || 'No content available for this project.',
        images: project.coverImage ? [project.coverImage] : []
      }]);
    }
  }, [project]);

  // Reset image index when page changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentPage]);

  const currentPageData = pages[currentPage] || {};
  const hasImages = currentPageData?.images?.length > 0;
  const hasMultipleImages = currentPageData?.images?.length > 1;
  const isImageOnlyPage = currentPageData?.isImageOnly === true;

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

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
      return;
    }

    if (!hasImages) return;
    
    if (e.key === 'ArrowRight') {
      if (hasMultipleImages) {
        setCurrentImageIndex(prev => 
          prev === currentPageData.images.length - 1 ? 0 : prev + 1
        );
      }
    } else if (e.key === 'ArrowLeft') {
      if (hasMultipleImages) {
        setCurrentImageIndex(prev => 
          prev === 0 ? currentPageData.images.length - 1 : prev - 1
        );
      }
    }
  }, [currentPageData?.images?.length, hasImages, hasMultipleImages, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentPageData) {
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
      <div className="flex-1 overflow-hidden bg-amber-50 dark:bg-slate-900">
        {isImageOnlyPage ? (
          // Image-only page layout
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <ImageDisplay
              image={currentPageData.images[currentImageIndex]}
              alt={currentPageData.images[currentImageIndex]?.alt || 'Project image'}
            />
            
            {/* Navigation Arrows for Image-Only Pages */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={() => {
                    setCurrentImageIndex(prev => 
                      prev === 0 ? currentPageData.images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    setCurrentImageIndex(prev => 
                      prev === currentPageData.images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-all"
              aria-label="View fullscreen"
            >
              <Maximize2 size={20} />
            </button>

            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {currentPageData.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Standard page layout with content
          <div className="h-full overflow-y-auto" ref={contentRef}>
            <div className="max-w-7xl mx-auto p-6">
              {currentPageData?.title && (
                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">
                  {currentPageData.title}
                </h3>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Column */}
                {hasImages && (
                  <div className="lg:sticky lg:top-6 self-start">
                    <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                      <ImageDisplay
                        image={currentPageData.images[currentImageIndex]}
                        alt={currentPageData.images[currentImageIndex]?.alt || `${currentPageData.title} - Image ${currentImageIndex + 1}`}
                      />

                      {hasMultipleImages && (
                        <>
                          <button
                            onClick={() => {
                              setCurrentImageIndex(prev => 
                                prev === 0 ? currentPageData.images.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="w-6 h-6" />
                          </button>
                          <button
                            onClick={() => {
                              setCurrentImageIndex(prev => 
                                prev === currentPageData.images.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={toggleFullscreen}
                        className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-all z-10 backdrop-blur-sm shadow-lg hover:scale-110 transform"
                        aria-label="View fullscreen"
                      >
                        <Maximize2 size={20} />
                      </button>

                      {hasMultipleImages && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                          {currentPageData.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-3 h-3 rounded-full transition-all ${
                                idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Column */}
                <div className="prose prose-lg max-w-none">
                  {currentPageData.content ? (
                    typeof currentPageData.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: currentPageData.content }} />
                    ) : (
                      <PortableText 
                        value={currentPageData.content} 
                        components={portableTextComponents} 
                      />
                    )
                  ) : (
                    <p className="text-slate-500">No content available for this page.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation - Always visible when multiple pages */}
      {pages.length > 1 && (
        <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentPage === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
                  onClick={() => setCurrentPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentPage
                      ? 'bg-teal-600 w-6'
                      : 'bg-slate-300 hover:bg-slate-400'
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
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
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
      {isFullscreen && hasImages && (
        <div 
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={toggleFullscreen}
        >
          <div className="relative max-w-full max-h-full">
            <ImageDisplay
              image={currentPageData.images[currentImageIndex]}
              alt={currentPageData.images[currentImageIndex]?.alt || 'Fullscreen view'}
              className="max-w-full max-h-[90vh]"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
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