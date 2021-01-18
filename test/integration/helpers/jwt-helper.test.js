describe('Helpers', () => {
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
