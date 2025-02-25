export default ({
  mixed: {
    notOneOf: () => 'oldUrl',
    required: () => 'empty',
  },
  string: {
    url: () => 'invalidUrl',
  },
});
