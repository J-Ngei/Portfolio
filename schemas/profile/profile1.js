// schemas/profile/profile1.js
export const profile1 = {
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      description: 'Your full name to display in the sidebar',
      validation: Rule => Rule.required().min(2).max(100)
    },
    {
      name: 'tagline',
      title: 'Professional Tagline',
      type: 'string',
      description: 'A short professional title or tagline (e.g., "Senior Developer")',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      description: 'Your profile picture for the sidebar',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photo',
      subtitle: 'tagline'
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        ...selection,
        subtitle: subtitle || 'No tagline set'
      };
    }
  }
};