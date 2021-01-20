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
    const path = require('path');
    const type = inputs.type;

    let key;
    const file = path.join(sails.config.appPath, `config/keys/${type}.pem`);
    const useFile = sails.config.jwt[`${type}File`];

    const fileExists = fs.existsSync(file);

    if (useFile && fileExists) {
      // @TODO: include passphrase for private key if applied
      key = fs.readFileSync(file, {
        encoding: 'utf-8',
      });
    } else {
      key = sails.config.jwt[`${type}Key`];
    }

    return key;
  },
};
