export const projectPage = {
  name: 'projectPage',
  title: 'Project Page',
  type: 'object',
  fields: [
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          {title: '📄 Standard Page (Text + Images)', value: 'standard'},
          {title: '🎨 Performance Showcase', value: 'performance'},
          {title: '🖼️ Image Gallery', value: 'gallery'},
          {title: '📊 Technical Deep Dive', value: 'technical'}
        ],
        layout: 'radio'
      },
      initialValue: 'standard',
      validation: Rule => Rule.required()
    },
    
    // === STANDARD PAGE FIELDS ===
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      hidden: ({ parent }) => parent?.pageType === 'gallery'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}],
      hidden: ({ parent }) => parent?.pageType !== 'standard'
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
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            }
          ]
        }
      ],
      hidden: ({ parent }) => parent?.pageType === 'performance' || parent?.pageType === 'technical'
    },
    
    // === PERFORMANCE SHOWCASE TEMPLATE ===
    {
      name: 'performanceTemplate',
      title: 'Performance Showcase Content',
      type: 'object',
      hidden: ({ parent }) => parent?.pageType !== 'performance',
      fields: [
        {
          name: 'hero',
          title: 'Hero Section',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'subtitle',
              title: 'Subtitle',
              type: 'text',
              rows: 2
            },
            {
              name: 'tags',
              title: 'Tags',
              type: 'array',
              of: [{type: 'string'}],
              options: {layout: 'tags'}
            },
            {
              name: 'colorTheme',
              title: 'Color Theme',
              type: 'string',
              options: {
                list: [
                  {title: 'Blue → Purple', value: 'blue-purple'},
                  {title: 'Green → Teal', value: 'green-teal'},
                  {title: 'Orange → Red', value: 'orange-red'},
                  {title: 'Indigo → Violet', value: 'indigo-violet'},
                  {title: 'Rose → Pink', value: 'rose-pink'},
                  {title: 'Slate → Gray', value: 'slate-gray'}
                ]
              },
              initialValue: 'blue-purple'
            }
          ]
        },
        {
          name: 'metrics',
          title: 'Key Metrics',
          type: 'array',
          of: [{
            type: 'object',
            fields: [
              {
                name: 'value',
                title: 'Value',
                type: 'string',
                placeholder: '292x',
                validation: Rule => Rule.required()
              },
              {
                name: 'label',
                title: 'Label',
                type: 'string',
                placeholder: 'Max Speedup',
                validation: Rule => Rule.required()
              },
              {
                name: 'color',
                title: 'Color',
                type: 'string',
                options: {
                  list: [
                    {title: 'Blue', value: 'blue'},
                    {title: 'Purple', value: 'purple'},
                    {title: 'Green', value: 'green'},
                    {title: 'Orange', value: 'orange'},
                    {title: 'Red', value: 'red'},
                    {title: 'Teal', value: 'teal'}
                  ]
                }
              }
            ],
            preview: {
              select: {
                value: 'value',
                label: 'label'
              },
              prepare({value, label}) {
                return {
                  title: value,
                  subtitle: label
                };
              }
            }
          }],
          validation: Rule => Rule.min(2).max(6)
        },
        {
          name: 'overview',
          title: 'Project Overview',
          type: 'array',
          of: [{type: 'block'}]
        },
        {
          name: 'architecture',
          title: 'Project Architecture',
          type: 'object',
          description: 'Add system architecture diagram or Mermaid diagram',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              initialValue: 'System Architecture'
            },
            {
              name: 'diagramType',
              title: 'Diagram Type',
              type: 'string',
              options: {
                list: [
                  {title: '🖼️ Image Upload', value: 'image'},
                  {title: '📊 Mermaid Diagram (Code)', value: 'mermaid'}
                ],
                layout: 'radio'
              },
              initialValue: 'image',
              validation: Rule => Rule.required()
            },
            {
              name: 'image',
              title: 'Architecture Diagram',
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'caption',
                  title: 'Caption',
                  type: 'string'
                }
              ],
              hidden: ({ parent }) => parent?.diagramType !== 'image',
              validation: Rule => Rule.custom((image, context) => {
                const diagramType = context.parent?.diagramType;
                if (diagramType === 'image' && !image) {
                  return 'Architecture image is required when diagram type is "Image Upload"';
                }
                return true;
              })
            },
            {
              name: 'mermaidCode',
              title: 'Mermaid Diagram Code',
              type: 'text',
              rows: 12,
              description: 'Enter Mermaid diagram syntax (e.g., flowchart, sequence diagram, etc.)',
              placeholder: `graph TD
    A[Client] -->|HTTP Request| B[API Gateway]
    B --> C[Load Balancer]
    C --> D[App Server 1]
    C --> E[App Server 2]
    D --> F[Database]
    E --> F`,
              hidden: ({ parent }) => parent?.diagramType !== 'mermaid',
              validation: Rule => Rule.custom((code, context) => {
                const diagramType = context.parent?.diagramType;
                if (diagramType === 'mermaid' && !code) {
                  return 'Mermaid code is required when diagram type is "Mermaid Diagram"';
                }
                return true;
              })
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Optional description of the architecture'
            }
          ]
        },
        {
          name: 'problem',
          title: 'Problem Statement',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'The Problem'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3
            },
            {
              name: 'points',
              title: 'Key Points',
              type: 'array',
              of: [{type: 'string'}]
            },
            {
              name: 'theme',
              title: 'Theme Color',
              type: 'string',
              options: {
                list: [
                  {title: 'Red (Critical)', value: 'red'},
                  {title: 'Orange (Warning)', value: 'orange'},
                  {title: 'Yellow (Caution)', value: 'yellow'}
                ]
              },
              initialValue: 'red'
            }
          ]
        },
        {
          name: 'solution',
          title: 'Solution Cards',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              initialValue: 'The Solution'
            },
            {
              name: 'layout',
              title: 'Grid Layout',
              type: 'string',
              options: {
                list: [
                  {title: '2 Columns', value: '2'},
                  {title: '3 Columns', value: '3'},
                  {title: '4 Columns', value: '4'}
                ]
              },
              initialValue: '2'
            },
            {
              name: 'cards',
              title: 'Solution Cards',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  {
                    name: 'icon',
                    title: 'Icon',
                    type: 'string',
                    options: {
                      list: [
                        {title: '💾 Database', value: 'database'},
                        {title: '📊 Chart', value: 'chart'},
                        {title: '⚡ Zap', value: 'zap'},
                        {title: '🎯 Target', value: 'target'},
                        {title: '🔧 Settings', value: 'settings'},
                        {title: '🖥️ Monitor', value: 'monitor'},
                        {title: '🔍 Search', value: 'search'},
                        {title: '📱 Smartphone', value: 'smartphone'}
                      ]
                    }
                  },
                  {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                    validation: Rule => Rule.required()
                  },
                  {
                    name: 'description',
                    title: 'Description',
                    type: 'text',
                    rows: 3
                  },
                  {
                    name: 'colorTheme',
                    title: 'Color Theme',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Blue', value: 'blue'},
                        {title: 'Green', value: 'green'},
                        {title: 'Purple', value: 'purple'},
                        {title: 'Orange', value: 'orange'},
                        {title: 'Teal', value: 'teal'},
                        {title: 'Rose', value: 'rose'}
                      ]
                    }
                  }
                ]
              }]
            }
          ]
        },
        {
          name: 'results',
          title: 'Results Section',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Performance Results'
            },
            {
              name: 'displayType',
              title: 'Display Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Table', value: 'table'},
                  {title: 'Image', value: 'image'},
                  {title: 'Both', value: 'both'}
                ]
              },
              initialValue: 'table'
            },
            {
              name: 'table',
              title: 'Performance Table',
              type: 'object',
              hidden: ({ parent }) => parent?.displayType === 'image',
              fields: [
                {
                  name: 'headers',
                  title: 'Table Headers',
                  type: 'array',
                  of: [{type: 'string'}],
                  initialValue: ['Query Type', 'Without Index', 'With Index', 'Speedup']
                },
                {
                  name: 'rows',
                  title: 'Table Rows',
                  type: 'array',
                  of: [{
                    type: 'object',
                    fields: [
                      {name: 'col1', title: 'Column 1', type: 'string'},
                      {name: 'col2', title: 'Column 2', type: 'string'},
                      {name: 'col3', title: 'Column 3', type: 'string'},
                      {name: 'col4', title: 'Column 4', type: 'string'}
                    ]
                  }]
                }
              ]
            },
            {
              name: 'resultImages',
              title: 'Result Images',
              type: 'array',
              hidden: ({ parent }) => parent?.displayType === 'table',
              of: [{
                type: 'image',
                options: {hotspot: true},
                fields: [
                  {
                    name: 'alt',
                    title: 'Alt Text',
                    type: 'string',
                    validation: Rule => Rule.required()
                  },
                  {
                    name: 'caption',
                    title: 'Caption',
                    type: 'string'
                  }
                ]
              }]
            }
          ]
        },
        {
          name: 'keyLearnings',
          title: 'Key Learnings',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Key Learnings'
            },
            {
              name: 'layout',
              title: 'Grid Layout',
              type: 'string',
              options: {
                list: [
                  {title: '2 Columns', value: '2'},
                  {title: '3 Columns', value: '3'},
                  {title: '4 Columns', value: '4'}
                ]
              },
              initialValue: '2'
            },
            {
              name: 'learnings',
              title: 'Learning Cards',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  {
                    name: 'icon',
                    title: 'Icon',
                    type: 'string',
                    options: {
                      list: [
                        {title: '💡 Lightbulb', value: 'lightbulb'},
                        {title: '🌳 Tree', value: 'tree'},
                        {title: '⚙️ Cogs', value: 'cogs'},
                        {title: '🔍 Filter', value: 'filter'},
                        {title: '🎯 Target', value: 'target'},
                        {title: '🚀 Rocket', value: 'rocket'}
                      ]
                    }
                  },
                  {
                    name: 'title',
                    title: 'Title',
                    type: 'string',
                    validation: Rule => Rule.required()
                  },
                  {
                    name: 'description',
                    title: 'Description',
                    type: 'text',
                    rows: 3
                  },
                  {
                    name: 'colorTheme',
                    title: 'Color Theme',
                    type: 'string',
                    options: {
                      list: [
                        {title: 'Blue', value: 'blue'},
                        {title: 'Green', value: 'green'},
                        {title: 'Purple', value: 'purple'},
                        {title: 'Orange', value: 'orange'},
                        {title: 'Teal', value: 'teal'},
                        {title: 'Rose', value: 'rose'}
                      ]
                    }
                  }
                ]
              }]
            }
          ]
        },
        {
          name: 'codeHighlight',
          title: 'Code Highlight',
          type: 'object',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Section Title',
              type: 'string',
              initialValue: 'Code Highlight'
            },
            {
              name: 'code',
              title: 'Code',
              type: 'text',
              rows: 10
            },
            {
              name: 'language',
              title: 'Programming Language',
              type: 'string',
              options: {
                list: [
                  {title: 'Python', value: 'python'},
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'TypeScript', value: 'typescript'},
                  {title: 'SQL', value: 'sql'},
                  {title: 'Bash', value: 'bash'},
                  {title: 'JSON', value: 'json'}
                ]
              }
            }
          ]
        },
        {
          name: 'projectLinks',
          title: 'Project Links',
          type: 'object',
          description: 'Links shown at the bottom of the page',
          fields: [
            {
              name: 'githubUrl',
              title: 'GitHub Repository URL',
              type: 'url',
              validation: Rule => Rule.uri({
                scheme: ['http', 'https']
              })
            },
            {
              name: 'demoUrl',
              title: 'Live Demo URL',
              type: 'url',
              validation: Rule => Rule.uri({
                scheme: ['http', 'https']
              })
            }
          ]
        }
      ]
    },
    
    // === TECHNICAL DEEP DIVE TEMPLATE ===
    {
      name: 'technicalTemplate',
      title: 'Technical Deep Dive Content',
      type: 'object',
      hidden: ({ parent }) => parent?.pageType !== 'technical',
      fields: [
        {
          name: 'title',
          title: 'Page Title',
          type: 'string'
        },
        {
          name: 'sections',
          title: 'Content Sections',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'textSection',
              title: 'Text Section',
              fields: [
                {name: 'title', type: 'string'},
                {name: 'content', type: 'array', of: [{type: 'block'}]}
              ]
            },
            {
              type: 'object',
              name: 'imageSection',
              title: 'Image Section',
              fields: [
                {
                  name: 'image',
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {name: 'alt', type: 'string', validation: Rule => Rule.required()},
                    {name: 'caption', type: 'string'}
                  ]
                },
                {
                  name: 'size',
                  title: 'Image Size',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Small', value: 'small'},
                      {title: 'Medium', value: 'medium'},
                      {title: 'Large', value: 'large'},
                      {title: 'Full Width', value: 'full'}
                    ]
                  },
                  initialValue: 'medium'
                }
              ]
            },
            {
              type: 'object',
              name: 'diagramSection',
              title: 'Architecture Diagram',
              fields: [
                {name: 'title', type: 'string'},
                {
                  name: 'diagram',
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {name: 'alt', type: 'string', validation: Rule => Rule.required()}
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      pageType: 'pageType',
      media: 'images.0'
    },
    prepare(selection) {
      const {title, pageType, media} = selection;
      const typeLabels = {
        standard: 'Standard',
        performance: 'Performance',
        gallery: 'Gallery',
        technical: 'Technical'
      };
      return {
        title: title || typeLabels[pageType] || 'Untitled Page',
        subtitle: typeLabels[pageType],
        media
      };
    }
  }
};