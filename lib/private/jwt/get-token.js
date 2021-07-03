module.exports = {
  friendlyName: 'Get token',

  description: 'Get token value from authorization async',

  inputs: {
    req: {
      type: 'ref',
      friendlyName: 'Request',
      description: 'A reference to the request object (req).',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Token value',
    },

    notFound: {
      description: 'Bearer authentication token was not found in header',
    },
  },

  fn: async function ({ req }, exits) {
    sails.log.silly('Authorization: ', req.headers.authorization);

    // if there's nothing after "Bearer", no go
    if (
      !req.headers.authorization ||
      !req.headers.authorization.split('Bearer ')[1]
    ) {
      return exits.notFound();
    }

    // if one exists, attempt to get the header data
    const token = req.headers.authorization.replace('Bearer ', '');

    return exits.success(token);
  },
};
