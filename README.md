# sails-hook-jwtoken - jsonwebtoken hook for Sails.js v1

## Installation

```
npm i sails-hook-jwtoken
```

![npm](https://img.shields.io/npm/v/sails-hook-jwtoken?style=for-the-badge)

![Travis (.org)](https://img.shields.io/travis/jorgevrgs/sails-hook-jwtoken?style=for-the-badge)

[![Node.js Package](https://github.com/jorgevrgs/sails-hook-jwtoken/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/jorgevrgs/sails-hook-jwtoken/actions/workflows/npm-publish.yml)

## How to use

### sails.helpers.jwt.sign(payload) Generate your token

```js
// api/controller/entrance/login
...
const jwtToken = await sails.helpers.jwt.sign({
  sub: userRecord.id,
});

return jwtToken;
```

### sails.helpers.jwt.verify(req, res) Verify token

By default the module include a validation hook for the authorization header, however the user could disable the default and implement a custom one with the configuration set to `sails.config.jwt.enableRequestHook = false`.

### Process your `req.me` object

The hook expose `req.me` to be used either in a controller or a policy. However, the user is able to disable this hook to implement one manually with the option `sails.config.jwt.enableRequestHook = false` in the configuration.

## Configuration

There are a couple of options to configure a Json Web Token signature, either with a private/public string or a private/public key file.

Default configuration:

```js
module.exports.jwt: {
  model: 'user',
  privateFile: false,
  publicFile: false,
  privateFileName: 'private',
  publicFileName: 'public',
  ext: '.pem',
  passphrase: '',
  privateKey: 'super-secret-string',
  publicKey: 'super-secret-string',
  enableRequestHook: true,
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
  privateFileName: 'private_passphrase', // Default 'private'
  publicFile: true,
  publicFileName: 'public_passphrase', // Default 'public'
  ext: '.pem', // Default
  passphrase: 'test' // Default ''

  signOptions: {
    algorithm: 'RS256',
    expiresIn: '7d',
  },
  verifyOptions: {
    algorithms: ['RS256'],
  },
},

```

When use a private/public file, create your files with the `privateFileName`, `publicFileName` and `ext` configuration:

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

## Example

If you want to implement your own token verification process, then set configuration `sails.config.jwt.enableRequestHook = false` in the `config/jwt.js` file:

```js
// config/jwt.js
module.exports.jwt = {
  ...
  enableRequestHook: false
}
```

### Implement a Policy

Run `sails generate policy check-token`.

Check the token:

```js
// api/policies/check-token.js
// req.authorization = 'Bearer {{token}}'
module.exports = async function (req, res) {
  const user = await sails.helpers.jwt
    .verify(req, res, next)
    .tolerate((err) => sails.log.silly(err));
  if (user) {
    req.me = user;
  }

  next();
};
```

Use the policy in the controllers:

```js
// config/policies.js
module.exports.policies = {
  '*': 'is-super-admin',
  'private/*': ['check-token', 'check-permissions', 'other-policies'],
  'public/*': true,
};
```

### Implement a Hook

Run `sails generate hook check-token`.

Check the token:

```js
// api/hooks/check-token/index.js
// req.authorization = 'Bearer {{token}}'
...
routes: {
  before: {
    '/*': {
      skipAssets: true,
      fn: async function(req, res, next) {
        const user = await sails.helpers.jwt.verify(req, res).tolerate((err) => sails.log.silly(err));
        if (user) {
          req.me = user;
        }
        next();
      }
    }
  }
}
```
