module.exports = {
  friendlyName: 'Public controller',

  description: 'Access this controller withou authentication.',

  exits: {
    success: {
      description: 'The access to this controller is free.',
    },
  },

  fn: function () {
    return true;
  },
};
