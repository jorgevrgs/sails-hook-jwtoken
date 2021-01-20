// var token = '';
const { assert } = require('chai');
var tokenFromString = '';
var tokenFromFile = '';
var user;
var configurationBackup;

describe('Helpers', function () {
  before(async function () {
    user = await sails.models[sails.config.jwt.model]
      .create({
        fullName: 'Mock Helpers',
        emailAddress: 'helpers.test@example.com',
        password: 'abc123',
      })
      .fetch();
  });

  after(async function () {
    await sails.models[sails.config.jwt.model].destroyOne({
      id: user.id,
    });
  });

  describe('Exists', function () {
    it('"sails.helpers.jwt" should be defined', function () {
      assert.isDefined(sails.helpers.jwt);
    });

    it('"sails.helpers.jwt.key" should be defined', function () {
      assert.isDefined(sails.helpers.jwt.key);
    });

    it('"sails.helpers.jwt.sign" should be defined', function () {
      assert.isDefined(sails.helpers.jwt.sign);
    });

    it('"sails.helpers.jwt.verify" should be defined', function () {
      assert.isDefined(sails.helpers.jwt.verify);
    });
  });

  // describe('Key, Sign & Verify', function () {
  describe('Using string configuration', function () {
    before(function () {
      configurationBackup = Object.assign({}, sails.config.jwt);

      Object.assign(sails.config.jwt, {
        privateKey: 'an-improved-super-secret-string',
        publicKey: 'an-improved-super-secret-string',
      });
    });

    after(function () {
      sails.config.jwt = configurationBackup;
    });

    it('Should load a private key from string', async function () {
      const key = await sails.helpers.jwt.key('private');

      assert.equal(key, sails.config.jwt.privateKey);
    });

    it('Should sign a key from string', async function () {
      tokenFromString = await sails.helpers.jwt.sign({ sub: user.id });

      assert.isString(tokenFromString);
    });

    it('Should validate a key from string', async function () {
      const authenticatedUser = await sails.helpers.jwt.verify({
        headers: {
          authorization: `Bearer ${tokenFromString}`,
        },
      });

      assert.isDefined(authenticatedUser.id);
    });
  });

  describe('Using file configuration', function () {
    before(function () {
      configurationBackup = Object.assign({}, sails.config.jwt);

      Object.assign(sails.config.jwt, {
        privateFile: true,
        publicFile: true,
        signOptions: {
          algorithm: 'RS256',
          expiresIn: '7d',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      });
    });

    after(function () {
      sails.config.jwt = configurationBackup;
    });

    it('Should load a private key from file', async function () {
      const key = await sails.helpers.jwt.key('private');

      assert.notEqual(key, sails.config.jwt.privateKey);
    });

    it('Should sign a key from file', async function () {
      tokenFromFile = await sails.helpers.jwt.sign({ sub: user.id });

      assert.isString(tokenFromFile);
    });

    it('Should verify a key from file', async function () {
      const authenticatedUser = await sails.helpers.jwt.verify({
        headers: {
          authorization: `Bearer ${tokenFromFile}`,
        },
      });

      assert.isDefined(authenticatedUser.id);
    });
  });

  describe('Using passphrase certificates', function () {
    before(function () {
      configurationBackup = Object.assign({}, sails.config.jwt);

      Object.assign(sails.config.jwt, {
        privateFile: true,
        privateFileName: 'private_passphrase',
        passphrase: 'test',
        publicFile: true,
        publicFileName: 'public_passphrase',

        signOptions: {
          algorithm: 'RS256',
          expiresIn: '7d',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      });
    });

    after(function () {
      sails.config.jwt = configurationBackup;
    });

    it('Should load a private {key, passphrase} object', async function () {
      const key = await sails.helpers.jwt.key('private');

      assert.hasAllKeys(key, ['key', 'passphrase']);
    });

    it('Should sign a key from file', async function () {
      tokenFromFile = await sails.helpers.jwt.sign({ sub: user.id });

      assert.isString(tokenFromFile);
    });

    it('Should verify a key from file', async function () {
      const authenticatedUser = await sails.helpers.jwt.verify({
        headers: {
          authorization: `Bearer ${tokenFromFile}`,
        },
      });

      assert.isDefined(authenticatedUser.id);
    });
  });
  // });
});
