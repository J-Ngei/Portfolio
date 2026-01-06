export const thoughts = {
  name: 'thoughts',
  title: 'Thoughts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short, attention-grabbing title',
      validation: Rule => Rule.required().max(100)
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
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'When was this thought published?',
      initialValue: (new Date()).toISOString(),
      validation: Rule => Rule.required()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Quote', value: 'blockquote'},
            {title: 'Code', value: 'code'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'}
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image'
            }
          ]
        },
        {
          type: 'codeBlock',
          title: 'Code Block'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      },
      description: 'Add relevant tags to help with discoverability'
    },
    {
      name: 'isPinned',
      title: 'Pin this thought',
      type: 'boolean',
      description: 'Pin this thought to the top of the thoughts page',
      initialValue: false
    },
    {
      name: 'mood',
      title: 'Mood',
      type: 'string',
      description: 'How are you feeling about this thought?',
      options: {
        list: [
          {title: '🤔 Thinking', value: 'thinking'},
          {title: '🎯 Focused', value: 'focused'},
          {title: '💡 Idea', value: 'idea'},
          {title: '🚀 Excited', value: 'excited'},
          {title: '🤯 Mind-blown', value: 'mindblown'},
          {title: '📚 Learning', value: 'learning'},
          {title: '🔍 Exploring', value: 'exploring'},
          {title: '🎨 Creative', value: 'creative'}
        ],
        layout: 'dropdown'
      }
    },
    {
      name: 'relatedLinks',
      title: 'Related Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Link Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required().uri({
                scheme: ['http', 'https', 'mailto', 'tel']
              })
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'url'
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      isPinned: 'isPinned',
      mood: 'mood'
    },
    prepare({title, publishedAt, isPinned, mood}) {
      const emojiMap = {
        thinking: '🤔',
        focused: '🎯',
        idea: '💡',
        excited: '🚀',
        mindblown: '🤯',
        learning: '📚',
        exploring: '🔍',
        creative: '🎨'
      };
      
      const emoji = mood ? emojiMap[mood] || '' : '';
      
      return {
        title: `${isPinned ? '📌 ' : ''}${title}`,
        subtitle: `${new Date(publishedAt).toLocaleDateString()} ${emoji ? `• ${emoji}` : ''}`
      };
    }
  },
  orderings: [
    {
      title: 'Pinned First, Then Newest',
      name: 'pinnedAndNewest',
      by: [
        {field: 'isPinned', direction: 'desc'},
        {field: 'publishedAt', direction: 'desc'}
      ]
    }
  ]
};
