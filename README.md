# sails-hook-jsonwebtoken

jsonwebtoken hook for Sails.js v1

## Installation

```
npm i sails-hook-jwtoken
```

![David](https://img.shields.io/david/jorgevrgs/sails-hook-jsonwebtoken?style=for-the-badge)

![npm](https://img.shields.io/npm/v/sails-hook-jwtoken?style=for-the-badge)

## How to use

### Generate your token in a controller:

```js
// api/controller/entrance/login

module.exports = {
  friendlyName: 'Login',

  description: 'Log in using the provided email and password combination.',

  inputs: {
    emailAddress: {
      description: 'The email to try in this attempt, e.g. "irl@example.com".',
      type: 'string',
      required: true,
    },

    password: {
      description:
        'The unencrypted password to try in this attempt, e.g. "passwordlol".',
      type: 'string',
      required: true,
    },
  }

  exits: {
    success: {
      description: 'The requesting user agent has been successfully logged in.'
    },

    badCombo: {
      description: 'The provided email and password combination does not match any user in the database.',
      responseType: 'unauthorized',
    },

    notFound: {
      description: 'The provided email and password combination does not match any user in the database.',
      responseType: 'unauthorized',
    },

    fn: async function (inputs) {
      let userRecord = await User.findOne({
        emailAddress: inputs.emailAddress.toLowerCase(),
      });

      if (!userRecord) {
        throw 'notFound';
      }

      await sails.helpers.passwords
      .checkPassword(inputs.password, userRecord.password)
      .intercept('incorrect', 'badCombo');

      const jwtToken = await sails.helpers.jwt.sign({
        sub: userRecord.id,
      });

      return {
        me: userRecord,
        token: jwtToken,
      };
    }

  }
};
```

### Process your `req.me` object

In each request an object `req.me` is loaded if there is an `Authorization: Bearer {jwtToken}`, then you can use it for controllers or policies:

**Configure your policies**:

```js
// config/policies.js

module.exports.policies = {
  // General
  '*': 'is-authenticated',

  // Blueprints
  'user/find': 'is-authenticated',

  // Security
  'security/grant-csrf-token': true,

  // Controllers
  'public/*': true,
  'private/*': 'is-authenticated',
};
```

**Define your policies**:

```js
// api/policies/is-authenticated.js
module.exports = async function (req, res, proceed) {
  if (req.me) {
    return proceed();
  }

  return res.forbidden();
};
```

**Configure your routes**:

```js
// config/routes.js
module.exports.routes = {
  'POST /api/v1/login': { action: 'public/login' },
  'POST /api/v1/account': { action: 'private/account' },
};
```

## Configuration

There are a couple of options to configure a Json Web Token signature, either with a private/public string or a private/public key file.

Default configuration:

```js
module.exports.jwt: {
  model: 'user',
  privateFile: false,
  publicFile: false,
  privateKey: 'super-secret-string',
  publicKey: 'super-secret-string',
  signOptions: {
    algorithm: 'HS256',
    expiresIn: '7d',
  },
  verifyOptions: {
    algorithms: ['HS256'],
  },
},
```

### String Configuration

Example:

```js
// config/jwt.js

module.exports.jwt: {
  privateKey: 'an-impoved-super-secret-string',
  publicKey: 'an-impoved-super-secret-string',
},

```

### File Configuration

Example:

```js
// config/jwt.js

module.exports.jwt: {
  privateFile: true,
  publicFile: true,
  signOptions: {
    algorithm: 'RS256',
    expiresIn: '7d',
  },
  verifyOptions: {
    algorithms: ['HS256'],
  },
},

```

When use a private/public file, create your files:

private: `config/keys/private.pem`

```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

public: `config/keys/public.pem`

```
-----BEGIN PUBLIC KEY-----
...
-----END PUBLIC KEY-----

```

Check this example in StackOverflow to [generate a private / public key](https://stackoverflow.com/questions/40595895/how-can-i-generate-the-private-and-public-certificates-for-jwt-with-rs256-algori).

```
openssl genrsa -aes256 -out private.pem 2048
openssl rsa -pubout -in private.pem -out public.pem
```

Or another article [Creating RSA Keys using OpenSSL](https://www.scottbrady91.com/OpenSSL/Creating-RSA-Keys-using-OpenSSL).

```
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
