export default {
  type: 'object',
  properties: {
    Title: { type: 'string' },
    Description: { type: 'string' },
    Image: { type: 'string' },
    Price: { type: 'number' }
  },
  required: ['Title', 'Description', 'Image', 'Price']
} as const;
