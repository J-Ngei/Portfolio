export const research = {
  name: 'research',
  title: 'Research',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
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
      name: 'authors',
      title: 'Authors',
      type: 'string',
      description: 'Comma-separated list of authors',
      validation: Rule => Rule.required()
    },
    {
      name: 'publication',
      title: 'Publication/Conference',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'publicationDate',
      title: 'Publication Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'abstract',
      title: 'Abstract',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required()
    },
    {
      name: 'doi',
      title: 'DOI',
      type: 'string',
      description: 'Digital Object Identifier (if available)'
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'Link to full paper or abstract',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      })
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this in featured research section',
      initialValue: false
    }
  ],
  preview: {
    select: {
      title: 'title',
      authors: 'authors',
      publication: 'publication',
      date: 'publicationDate',
      featured: 'featured'
    },
    prepare(selection) {
      const {title, authors, publication, date, featured} = selection;
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${authors} - ${publication} (${new Date(date).getFullYear()})`
      };
    }
  }
};
