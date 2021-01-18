const { assert } = require('chai');
var token = '';
var user = {};

describe('Hooks', () => {
  describe('Users', () => {
    it('Should get a CSRF token', function (done) {
      app
        .get('/api/v1/csrf-token')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
          assert.isDefined(res.body._csrf);
          return done();
        })
        .catch((err) => done(err));
    });

    it('Should create an user', function (done) {
      const Model = sails.models[sails.config.jwt.model];

      Model.create({
        fullName: 'John Doe',
        emailAddress: 'user@example.com',
        password: 'abc123',
      })
        .meta({ fetch: true })
        .then(async function (data) {
          if (!data) {
            return done(new Error('An empty user was received!'));
          }

          /**
           * @var token
           */
          user = data;

          assert.hasAnyKeys(data, [
            'id',
            'fullName',
            'emailAddress',
            'password',
          ]);

          done();
        })
        .catch((error) => {
          done(error);
        });
    });

    it('Should generate a token with the user', function (done) {
      const Model = sails.models[sails.config.jwt.model];

      Model.findOne({
        id: user.id,
      })
        .then(async function (data) {
          const jwtToken = await sails.helpers.jwt.sign({
            sub: data.id,
          });

          /**
           * @var token
           */
          token = jwtToken;
          assert.isString(token);

          done();
        })
        .catch((error) => done(error));
    });
  });

  describe('Tokens', () => {
    it('Should allow /api/v1/login without authentication', function (done) {
      app
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .expect(200)
        .then((res) => {
          assert.isTrue(res.body);
          return done();
        })
        .catch((err) => done(err));
    });

    it('Should allow /api/v1/account with authentication', function (done) {
      app
        .post('/api/v1/account')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((res) => {
          assert.isFalse(res.body);
          return done();
        })
        .catch((err) => done(err));
    });
  });
});
