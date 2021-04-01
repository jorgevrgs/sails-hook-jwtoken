# sails-hook-jwtoken - jsonwebtoken hook for Sails.js v1

## Installation

```
npm i sails-hook-jwtoken
```

![David](https://img.shields.io/david/jorgevrgs/sails-hook-jwtoken?style=for-the-badge)

![npm](https://img.shields.io/npm/v/sails-hook-jwtoken?style=for-the-badge)

## How to use

### Generate your token in a controller:

```js
// api/controller/entrance/login
...
const jwtToken = await sails.helpers.jwt.sign({
  sub: userRecord.id,
});

return jwtToken;
```

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
