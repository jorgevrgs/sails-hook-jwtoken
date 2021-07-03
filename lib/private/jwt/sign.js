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

    privateKey: {
      type: 'string',
      description: 'Private key',
    },

    signOptions: {
      type: 'ref',
      thisdescription: 'Sign options object',
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

  fn: async function ({ payload, privateKey, signOptions }, exits) {
    try {
      const jwt = require('jsonwebtoken');
      const _ = require('@sailshq/lodash');

      if (!privateKey) {
        privateKey = await sails.helpers.jwt.key('private');
      }

      if (_.isEmpty(signOptions)) {
        signOptions = sails.config.jwt.signOptions;
      }

      const signed = jwt.sign(payload, privateKey, signOptions);

      return exits.success(signed);
    } catch (error) {
      sails.log.verbose({ error });
      return exits.badRequest();
    }
  },
};
