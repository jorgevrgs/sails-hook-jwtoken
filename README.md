# sails-hook-jsonwebtoken

jsonwebtoken hook for Sails.js v1

## Installation

```
npm i PENDING
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
