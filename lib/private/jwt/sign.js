module.exports = {
  friendlyName: 'Sign JWT',
  description: 'Sign a payload with a JWT token.',
  inputs: {
    payload: {
      description: 'Payload object with the user id',
      type: 'ref',
      required: true,
      example: {
        sub: 1,
      },
    },
  },
  exits: {
    success: {
      description: 'Token was succesfully signed',
    },

    badRequest: {
      description: 'It was not possible to sign payload',
    },
  },

  fn: async function ({ payload }, exits) {
    try {
      const jwt = require('jsonwebtoken');

      let privateKey = await sails.helpers.jwt.key('private');
      const options = sails.config.jwt.signOptions;
      const signed = jwt.sign(payload, privateKey, options);

      return exits.success(signed);
    } catch (error) {
      sails.log.error({ error });
      return exits.badRequest;
    }
  },
};
