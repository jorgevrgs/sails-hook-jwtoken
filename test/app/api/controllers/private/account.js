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
    if (this.req.me) {
      return {
        data: true,
        message: 'You should receive this data',
      };
    }

    return {
      data: false,
      message: 'You should not receive this data',
    };
  },
};
