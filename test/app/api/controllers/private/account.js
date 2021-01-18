module.exports = {
  friendlyName: 'Private controller',

  description: 'Access to this controller require an authenticated user.',

  exits: {
    success: {
      description:
        'The access to this controller is allowed only for authenticated users.',
    },
  },

  fn: function () {
    return false;
  },
};
