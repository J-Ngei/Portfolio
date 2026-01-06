export const project = {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'GIS', value: 'gis'},
          {title: 'Software Solutions', value: 'software'},
          {title: 'AI/ML', value: 'aiml'}
        ],
        layout: 'dropdown'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown on project card',
      validation: Rule => Rule.required().max(200)
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'technologies',
      title: 'Technologies',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'demoUrl',
      title: 'Live Demo URL',
      type: 'url',
      description: 'Link to live project demo'
    },
    {
      name: 'sourceCodeUrl',
      title: 'Source Code URL',
      type: 'url',
      description: 'Link to GitHub repository'
    },
    {
      name: 'content',
      title: 'Project Details',
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text'
            }
          ]
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave empty if still in progress'
    },
    {
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      description: 'Show this project in featured section',
      initialValue: false
    },
    {
      name: 'pages',
      title: 'Presentation Pages',
      type: 'array',
      of: [
        {
          type: 'projectPage'
        }
      ],
      description: 'Add presentation pages for this project',
      validation: Rule => Rule.min(1).required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'coverImage',
      featured: 'featured'
    },
    prepare(selection) {
      const {title, category, media, featured} = selection;
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: category,
        media
      };
    }
  }
};
