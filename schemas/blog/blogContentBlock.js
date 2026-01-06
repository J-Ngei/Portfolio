export default {
  name: 'blogContentBlock',
  title: 'Blog Content Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
          {title: 'Full Width', value: 'full'},
        ],
        layout: 'radio',
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
};
