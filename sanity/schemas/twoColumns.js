export default {
  name: 'twoColumns',
  title: 'Two Columns',
  type: 'object',
  fields: [
    {
      name: 'leftColumn',
      title: 'Left Column',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'rightColumn',
      title: 'Right Column',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
  preview: {
    select: {
      left: 'leftColumn',
      right: 'rightColumn',
    },
    prepare(selection) {
      const { left, right } = selection;
      const leftText = left ? left[0]?.children[0]?.text || 'Empty' : 'Empty';
      const rightText = right ? right[0]?.children[0]?.text || 'Empty' : 'Empty';
      return {
        title: 'Two Columns',
        subtitle: `${leftText} | ${rightText}`,
      };
    },
  },
};
