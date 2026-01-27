import React from 'react';

const sizeClasses = {
  small: 'max-w-md',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
  full: 'max-w-full'
};

const ImageSection = ({ image, size = 'medium', imageUrlBuilder }) => {
  if (!image) return null;

  return (
    <div className={`${sizeClasses[size]} mx-auto my-8`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <img 
          src={imageUrlBuilder(image)} 
          alt={image.alt || 'Image'} 
          className="w-full h-auto"
        />
        {image.caption && (
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            {image.caption}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSection;