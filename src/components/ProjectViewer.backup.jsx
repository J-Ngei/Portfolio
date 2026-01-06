import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { PortableText } from '@portabletext/react';

// Helper function to build image URLs
const imageUrlBuilder = (source) => {
  if (source?.asset?.url) {
    return source.asset.url;
  }
  
  if (source?.asset?._ref) {
    const ref = source.asset._ref;
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/${projectId}/production/${id}-${dimensions}.${format}`;
  }

  return '/api/placeholder/400/300';
};

// Image Navigation Controls
const ImageNavigation = ({
  onPrev,
  onNext,
  onClose,
  onToggleFullscreen,
  isFullscreen,
  currentIndex,
  totalImages,
  onThumbnailClick,
  showThumbnails = true,
  className = ''
}) => (
  <div className={className}>
    {onPrev && onNext && (
      <>
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-20"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-20"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </>
    )}

    <div className="absolute top-4 right-4 flex gap-2 z-20">
      {onToggleFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-all backdrop-blur-sm"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      )}
      
      {onClose && (
        <button
          onClick={onClose}
          className="p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-all backdrop-blur-sm"
          aria-label="Close viewer"
        >
          <X size={20} />
        </button>
      )}
    </div>

    {showThumbnails && totalImages > 1 && (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
        {Array.from({ length: totalImages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onThumbnailClick?.(idx)}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
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
    h1: ({children}) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-bold my-2">{children}</h3>,
    normal: ({children}) => <p className="my-4">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-teal-500 pl-4 italic my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="mb-2">{children}</li>,
    number: ({children}) => <li className="mb-2">{children}</li>,
  },
  marks: {
    link: ({value, children}) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a href={value?.href} target={target} className="text-teal-600 hover:underline">
          {children}
        </a>
      );
    },
  },
  types: {
    twoColumns: ({ value }) => <TwoColumns value={value} />,
  },
};

// Image Display Component
const ImageDisplay = ({ image, alt, className = '' }) => {
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
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
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

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!hasImages) return;
    
    switch (e.key) {
      case 'ArrowRight':
        if (hasMultipleImages) {
          setCurrentImageIndex(prev => 
            prev === currentPageData.images.length - 1 ? 0 : prev + 1
          );
        } else {
          goToNextPage();
        }
        break;
      case 'ArrowLeft':
        if (hasMultipleImages) {
          setCurrentImageIndex(prev => 
            prev === 0 ? currentPageData.images.length - 1 : prev - 1
          );
        } else {
          goToPrevPage();
        }
        break;
      case 'Escape':
        setIsFullscreen(false);
        break;
      default:
        break;
    }
  }, [currentPageData?.images, hasImages, hasMultipleImages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Navigation functions
  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => {
        const nextPage = prev + 1;
        setCurrentImageIndex(0);
        return nextPage;
      });
      contentRef.current?.scrollTo(0, 0);
    }
  }, [currentPage, pages.length]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => {
        const prevPage = prev - 1;
        setCurrentImageIndex(0);
        return prevPage;
      });
      contentRef.current?.scrollTo(0, 0);
    }
  }, [currentPage]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

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
  const [currentPage, setCurrentPage] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (project.pages && project.pages.length > 0) {
      setPages(project.pages);
    } else {
      setPages([
        {
          title: project.title || "Project Overview",
          content: project.content || "No content available for this project.",
          images: project.coverImage ? [project.coverImage] : []
        }
      ]);
    }
  }, [project]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentPage]);

  const currentPageData = pages[currentPage];
  const hasImages = currentPageData?.images?.length > 0;
  const hasMultipleImages = currentPageData?.images?.length > 1;
  const isImageOnlyPage = currentPageData?.isImageOnly === true;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      if (!hasImages) return;
      setCurrentImageIndex(prev => 
        prev === currentPageData.images.length - 1 ? 0 : prev + 1
      );
    }
    if (e.key === 'ArrowLeft') {
      if (!hasImages) return;
      setCurrentImageIndex(prev => 
        prev === 0 ? currentPageData.images.length - 1 : prev - 1
      );
    }
    if (e.key === 'Escape') {
      setIsFullscreen(false);
    }
  }, [currentImageIndex, currentPageData?.images?.length, hasImages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  if (!currentPageData) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-teal-50 z-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading project data...</p>
        </div>
      </div>
    );
  }

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {!isImageOnlyPage && (
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {isImageOnlyPage ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            <img
              src={imageUrlBuilder(currentPageData.images[currentImageIndex])}
              alt={currentPageData.images[currentImageIndex]?.alt || 'Project image'}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Navigation Arrows for Image-Only Pages */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentPageData?.images?.length) return;
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!currentPageData?.images?.length) return;
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

            {/* Close button for Image-Only Pages */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(true);
              }}
              className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors"
            >
              <Maximize2 size={20} />
            </button>

            {/* Image Indicators for Image-Only Pages */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {currentPageData.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
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
          <div className="h-full px-8 py-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto h-full flex flex-col">
              {currentPageData?.title && (
                <h3 className="text-3xl font-bold text-slate-800 mb-8">
                  {currentPageData.title}
                </h3>
              )}

              <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-12">
                {hasImages && (
                  <div className="lg:w-1/2 flex items-center">
                    <div className="w-full">
                      <div className="relative rounded-xl overflow-hidden shadow-lg bg-slate-100 group" style={{ height: '500px' }}>
                        <div className="w-full h-full flex items-center justify-center p-4">
                          <img
                            src={imageUrlBuilder(currentPageData.images[currentImageIndex])}
                            alt={currentPageData.images[currentImageIndex]?.alt || `${currentPageData.title} - Image ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!currentPageData?.images?.length) return;
                                setCurrentImageIndex(prev => 
                                  prev === 0 ? currentPageData.images.length - 1 : prev - 1
                                );
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!currentPageData?.images?.length) return;
                                setCurrentImageIndex(prev => 
                                  prev === currentPageData.images.length - 1 ? 0 : prev + 1
                                );
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
                              aria-label="Next image"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(true);
                          }}
                          className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-all z-10 backdrop-blur-sm shadow-lg hover:scale-110 transform"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          aria-label="View fullscreen"
                        >
                          <Maximize2 size={20} className="flex-shrink-0" />
                        </button>

                        {hasMultipleImages && (
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {currentPageData.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(idx);
                                }}
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
                  </div>
                )}

                <div className={`flex items-start ${hasImages ? 'lg:w-1/2' : 'w-full'}`}>
                  <div className="w-full text-slate-700">
                    {currentPageData.content ? (
                      Array.isArray(currentPageData.content) ? (
                        <PortableText 
                          value={currentPageData.content}
                          components={portableTextComponents}
                        />
                      ) : (
                        <p className="prose prose-lg whitespace-pre-line">{currentPageData.content}</p>
                      )
                    ) : (
                      <p className="prose prose-lg">No content available for this page.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isImageOnlyPage && pages.length > 1 && (
        <div className="absolute bottom-20 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 px-6">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                currentPage === 0
                  ? 'bg-black/30 text-white/50 cursor-not-allowed'
                  : 'bg-black/50 text-white hover:bg-black/75 shadow-md hover:shadow-lg backdrop-blur-sm'
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
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
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
                  ? 'bg-black/30 text-white/50 cursor-not-allowed'
                  : 'bg-black/50 text-white hover:bg-black/75 shadow-md hover:shadow-lg backdrop-blur-sm'
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      {!isImageOnlyPage && pages.length > 1 && (
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
      
      {isFullscreen && currentPageData?.images?.[currentImageIndex] && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={imageUrlBuilder(currentPageData.images[currentImageIndex])}
              alt={currentPageData.images[currentImageIndex]?.alt || 'Fullscreen view'}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
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

  // Fullscreen overlay for image viewing
  if (isFullscreen && hasImages) {
    return (
      <div 
        className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
        onClick={() => setIsFullscreen(false)}
      >
        <div className="relative max-w-full max-h-full">
          <img
            src={imageUrlBuilder(currentPageData.images[currentImageIndex])}
            alt={currentPageData.images[currentImageIndex]?.alt || 'Fullscreen view'}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Exit fullscreen"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-800">{project.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" ref={contentRef}>
        <div className="max-w-7xl mx-auto p-6">
          {currentPageData.title && (
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              {currentPageData.title}
            </h1>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Column */}
            {hasImages && (
              <div className="lg:sticky lg:top-6 self-start">
                <div className="relative bg-slate-100 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <ImageDisplay
                    image={currentPageData.images[currentImageIndex]}
                    alt={currentPageData.images[currentImageIndex]?.alt || 'Project image'}
                    className="cursor-zoom-in"
                    onClick={toggleFullscreen}
                  />

                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => 
                            prev === 0 ? currentPageData.images.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(prev => 
                            prev === currentPageData.images.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors z-10"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image Indicators */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {currentPageData.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-teal-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
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

      {/* Footer Navigation */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-inner">
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

          {/* Page Indicators */}
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
    </div>
  );
};

export default ProjectViewer;