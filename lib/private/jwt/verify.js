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

  fn: async function (inputs, exits) {
    const jwt = require('jsonwebtoken');

    const req = inputs.req;

    // if there's nothing after "Bearer", no go
    if (
      !req.headers.authorization ||
      !req.headers.authorization.split('Bearer ')[1]
    ) {
      sails.log.verbose({ notBearerFoundInHeader: req.headers.authorization });
      return exits.notBearerFoundInHeader();
    }

    // if one exists, attempt to get the header data
    const token = req.headers.authorization.split('Bearer ')[1];

    let publicKey = await sails.helpers.jwt.key('public');
    const options = sails.config.jwt.verifyOptions;

    jwt.verify(token, publicKey, options, async (err, payload) => {
      if (!payload || typeof payload.sub === 'undefined') {
        sails.log.verbose({ missingOrEmptySub: payload });

        return exits.missingOrEmptySub();
      }

      if (err) {
        sails.log.verbose({ jwtVerifyError: err });

        return exits.jwtVerifyError();
      }

      const model = sails.config.jwt.model;

      const Model = sails.models[model];

      if (!Model) {
        return exits.modelNotFound();
      }

      const user = await Model.findOne({
        id: payload.sub,
      });

      if (!user) {
        sails.log.error({ userNotFound: payload });
        return exits.userNotFound();
      }

      return exits.success(user);
    });
  },
};