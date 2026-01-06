export const about = {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      description: 'Upload your profile picture',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'cvFile',
      title: 'CV/Resume File',
      type: 'file',
      description: 'Upload your CV/Resume (PDF format)',
      options: {
        accept: '.pdf'
      },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'profileImage.alt',
      media: 'profileImage'
    },
    prepare(selection) {
      const { title, media } = selection;
      return {
        title: title || 'About Page',
        media: media
      };
    }
  }
};
