export const projectPage = {
  name: 'projectPage',
  title: 'Project Page',
  type: 'object',
  fields: [
    {
      name: 'isImageOnly',
      title: 'Image Only Page',
      type: 'boolean',
      description: 'Check this if this page should only display images in full screen',
      initialValue: false
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'Optional title for the page',
      hidden: ({ parent }) => parent?.isImageOnly === true
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional caption for the image'
            }
          ]
        }
      ],
      validation: Rule => Rule.custom((value, context) => {
        if (context.parent?.isImageOnly === true && (!value || value.length === 0)) {
          return 'At least one image is required for image-only pages';
        }
        return true;
      })
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({ parent }) => parent?.isImageOnly === true,
      validation: Rule => Rule.custom((content, context) => {
        if (context.parent?.isImageOnly !== true && !content) {
          return 'Content is required for non-image-only pages';
        }
        return true;
      })
    }
  ],
  preview: {
    select: {
      title: 'title',
      isImageOnly: 'isImageOnly',
      media: 'images.0'
    },
    prepare(selection) {
      const { title, isImageOnly, media } = selection;
      return {
        title: title || (isImageOnly ? 'Image Gallery' : 'Untitled Page'),
        subtitle: isImageOnly ? 'Image Only' : 'Standard Page',
        media
      };
    }
  }
};
