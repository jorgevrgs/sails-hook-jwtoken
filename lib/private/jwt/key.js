module.exports = {
  friendlyName: 'Verify JWT',

  description: 'Verify a JWT token and return the user object.',

  inputs: {
    type: {
      type: 'string',
      description: 'Define if required value is either private or public',
      required: true,
      isIn: ['private', 'public'],
    },
  },

  exits: {
    success: {
      description: 'Token was succesfully verified',
    },
  },

  fn: async function (inputs) {
    const fs = require('fs');
    const type = inputs.type;

    let key;
    const file = `config/keys/${type}.pem`;

    const fileExists = fs.existsSync('file');
    if (sails.config.jwt.privateFile && fileExists) {
      key = await sails.helpers.fs.read(file);
    } else {
      key = sails.config.jwt[`${type}Key`];
    }

    return key;
  },
};
