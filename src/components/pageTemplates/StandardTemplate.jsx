import React from 'react';
import { PortableText } from '@portabletext/react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const StandardTemplate = ({ 
  data, 
  imageUrlBuilder, 
  portableTextComponents,
  ImageDisplay,
  toggleFullscreen,
  currentImageIndex,
  setCurrentImageIndex
}) => {
  const hasImages = data.images && data.images.length > 0;
  const hasMultipleImages = data.images && data.images.length > 1;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        {data.title && (
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">
            {data.title}
          </h3>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Column */}
          {hasImages && (
            <div className="lg:sticky lg:top-6 self-start">
              <div className="relative bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <ImageDisplay
                  image={data.images[currentImageIndex]}
                  alt={data.images[currentImageIndex]?.alt || `${data.title} - Image ${currentImageIndex + 1}`}
                />

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentImageIndex(prev => 
                          prev === 0 ? data.images.length - 1 : prev - 1
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
                          prev === data.images.length - 1 ? 0 : prev + 1
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
                    {data.images.map((_, idx) => (
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
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {data.content ? (
              <PortableText 
                value={data.content} 
                components={portableTextComponents} 
              />
            ) : (
              <p className="text-slate-500">No content available for this page.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardTemplate;