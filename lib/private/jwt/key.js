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

    // Generate the filename
    const file = path.join(
      sails.config.appPath,
      `config/keys/${
        sails.config.jwt[
          type === 'private' ? 'privateFileName' : 'publicFileName'
        ]
      }${sails.config.jwt.ext}`
    );

    // Determine if use a file and the file exists
    const useFile = sails.config.jwt[`${type}File`];
    const fileExists = fs.existsSync(file);

    // If use a file and exists obtain the key value
    if (useFile && fileExists) {
      const string = fs.readFileSync(file, {
        encoding: 'utf-8',
      });

      // For private key, if a passphrase is defined then obtain an object
      if (sails.config.jwt.passphrase && type === 'private') {
        key = {
          key: string,
          passphrase: sails.config.jwt.passphrase,
        };
      } else {
        key = string;
      }
    } else {
      key = sails.config.jwt[`${type}Key`];
    }

    return key;
  },
};
