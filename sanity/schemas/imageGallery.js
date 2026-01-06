export default {
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption to display below the image'
            }
          ]
        }
      ],
      validation: Rule => Rule.min(1).error('At least one image is required')
    },
    {
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Single Image', value: 'single' },
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
          { title: 'Full Width', value: 'full' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'single'
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: 'Original', value: 'original' },
          { title: 'Square (1:1)', value: '1:1' },
          { title: 'Landscape (16:9)', value: '16:9' },
          { title: 'Portrait (9:16)', value: '9:16' },
          { title: 'Widescreen (21:9)', value: '21:9' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'original',
      hidden: ({ parent }) => parent?.displayMode !== 'grid'
    },
    {
      name: 'maxColumns',
      title: 'Max Columns',
      type: 'number',
      options: {
        list: [
          { title: '1', value: 1 },
          { title: '2', value: 2 },
          { title: '3', value: 3 },
          { title: '4', value: 4 },
          { title: '6', value: 6 }
        ],
        layout: 'dropdown'
      },
      initialValue: 3,
      hidden: ({ parent }) => parent?.displayMode !== 'grid'
    }
  ],
  preview: {
    select: {
      images: 'images',
      displayMode: 'displayMode'
    },
    prepare(selection) {
      const { images, displayMode } = selection;
      const count = images?.length || 0;
      return {
        title: `Image Gallery (${count} ${count === 1 ? 'image' : 'images'})`,
        subtitle: `Display: ${displayMode || 'single'}`,
        media: images?.[0]?.asset
      };
    }
  }
};
