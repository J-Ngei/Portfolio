import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const GalleryTemplate = ({ 
  data, 
  imageUrlBuilder, 
  ImageDisplay,
  toggleFullscreen,
  currentImageIndex,
  setCurrentImageIndex
}) => {
  const images = data.images || [];

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      <ImageDisplay
        image={images[currentImageIndex]}
        alt={images[currentImageIndex]?.alt || 'Gallery image'}
      />
      
      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => {
              setCurrentImageIndex(prev => 
                prev === 0 ? images.length - 1 : prev - 1
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
                prev === images.length - 1 ? 0 : prev + 1
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
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, idx) => (
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

      {/* Caption */}
      {images[currentImageIndex]?.caption && (
        <div className="absolute bottom-16 left-0 right-0 text-center">
          <p className="text-white bg-black/50 inline-block px-4 py-2 rounded">
            {images[currentImageIndex].caption}
          </p>
        </div>
      )}
    </div>
  );
};

export default GalleryTemplate;