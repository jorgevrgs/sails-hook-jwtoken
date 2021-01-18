module.exports.datastores = {
  default: {
    adapter: 'sails-disk',
    inMemoryOnly: false,
    dir: './test/app/.tmp/local-disk',
  },
};
