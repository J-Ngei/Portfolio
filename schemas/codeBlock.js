export default {
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Python', value: 'python'},
          {title: 'Bash', value: 'bash'},
          {title: 'JSON', value: 'json'},
        ],
      },
    },
    {
      name: 'filename',
      title: 'Filename (optional)',
      type: 'string',
    },
    {
      name: 'code',
      title: 'Code',
      type: 'text',
    },
  ],
  preview: {
    select: {
      language: 'language',
      code: 'code',
    },
    prepare({language, code}) {
      return {
        title: language ? language.toUpperCase() : 'Code block',
        subtitle: code ? code.split('\n').slice(0, 2).join('\n') : 'No code',
      }
    },
  },
}
