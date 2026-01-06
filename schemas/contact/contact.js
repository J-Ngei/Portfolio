export default {
  name: 'contact',
  title: 'Contact Information',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Section title (e.g., "Get in Touch")',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description or introduction for the contact section'
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      description: 'Your professional email address',
      validation: Rule => Rule.required().regex(
        /[^@\s]+@[^@\s]+\.[^@\s]+/,
        { name: 'email', invert: true }
      )
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Your contact number (optional)'
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'GitHub', value: 'github' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Other', value: 'other' }
                ]
              }
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
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Name of the icon to use (if using an icon library)'
            }
          ],
          preview: {
            select: {
              title: 'platform',
              subtitle: 'url'
            }
          }
        }
      ]
    },
    {
      name: 'address',
      title: 'Physical Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street',
          type: 'string'
        },
        {
          name: 'city',
          title: 'City',
          type: 'string'
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string'
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string'
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string'
        }
      ]
    },
    {
      name: 'formEnabled',
      title: 'Enable Contact Form',
      type: 'boolean',
      description: 'Toggle to enable/disable the contact form',
      initialValue: true
    },
    {
      name: 'formFields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'fieldName',
              title: 'Field Name',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  'text',
                  'email',
                  'tel',
                  'textarea',
                  'select',
                  'checkbox'
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'required',
              title: 'Required',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'options',
              title: 'Options (for select/radio/checkbox)',
              type: 'array',
              of: [{ type: 'string' }],
              hidden: ({ parent }) => 
                !['select', 'radio', 'checkbox'].includes(parent?.fieldType)
            },
            {
              name: 'placeholder',
              title: 'Placeholder Text',
              type: 'string'
            }
          ],
          preview: {
            select: {
              title: 'fieldName',
              subtitle: 'fieldType',
              required: 'required'
            },
            prepare({ title, subtitle, required }) {
              return {
                title: `${title} ${required ? '*' : ''}`,
                subtitle: `Type: ${subtitle}`
              };
            }
          }
        }
      ],
      description: 'Customize the fields for the contact form',
      hidden: ({ parent }) => !parent?.formEnabled
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'email'
    }
  }
};
