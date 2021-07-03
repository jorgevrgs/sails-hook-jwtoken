module.exports = {
  friendlyName: 'Verify JWT',

  description: 'Verify a JWT token and return the user object.',

  inputs: {
    req: {
      type: 'ref',
      friendlyName: 'Request',
      description: 'A reference to the request object (req).',
      required: true,
    },

    res: {
      type: 'ref',
      friendlyName: 'Response',
      description: 'A reference to the response object (res).',
      required: false,
    },

    publicKey: {
      type: 'string',
      description: 'Public key value',
    },

    verifyOptions: {
      type: 'ref',
      description: 'Verify options object',
    },
  },

  exits: {
    success: {
      description: 'Token was succesfully verified',
    },

    notBearerFoundInHeader: {
      description: 'Bearer authentication token was not found in header',
    },

    missingOrEmptySub: {
      description: 'A missing payload or sub value error occurred',
    },

    jwtVerifyError: {
      description: 'An error occurred when trying to validate the token',
    },

    modelNotFound: {
      description: 'An error occurred when tryn to access User model',
    },

    userNotFound: {
      description: 'User has been not found in database',
    },
  },

  fn: async function ({ req, publicKey, verifyOptions }, exits) {
    sails.log.silly('sails.helpers.jwt.verify: ', req.headers.authorization);

    const jwt = require('jsonwebtoken');

    // if there's nothing after "Bearer", no go
    const token = sails.helpers.jwt.getTokenSync(req);

    if (!token) {
      return exits.notBearerFoundInHeader();
    }

    if (!publicKey) {
      publicKey = await sails.helpers.jwt.key('public');
    }

    if (!verifyOptions) {
      verifyOptions = sails.config.jwt.verifyOptions;
    }

    jwt.verify(token, publicKey, verifyOptions, async (err, payload) => {
      if (err) {
        sails.log.verbose(err);
        return exits.jwtVerifyError();
      }

      if (!payload || typeof payload.sub === 'undefined') {
        return exits.missingOrEmptySub();
      }

      // Get model object
      const model = sails.config.jwt.model;
      const Model = sails.models[model];

      if (!Model) {
        return exits.modelNotFound();
      }

      // Get user from sub payload
      const user = await Model.findOne({
        [Model.primaryKey]: payload.sub,
      });

      if (!user) {
        return exits.userNotFound();
      }

      return exits.success(user);
    });
  },
};
