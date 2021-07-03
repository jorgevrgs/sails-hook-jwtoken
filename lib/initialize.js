/**
 * Dependencies
 */
const _ = require('@sailshq/lodash');
const DRY_PACKS_BY_SLUG = require('../accessible/dry');

module.exports = function (sails) {
  return function (done) {
    if (!sails.hooks.helpers) {
      return done(
        new Error(
          'Cannot load sails-hook-jsonwebtoken without enabling the "helpers" hook!'
        )
      );
    }

    if (!sails.hooks.orm) {
      return done(
        new Error(
          'Cannot load sails-hook-jsonwebtoken without enabling the "sails-hook-orm" hook!'
        )
      );
    }

    sails.after('hook:helpers:loaded', function () {
      try {
        _.each(DRY_PACKS_BY_SLUG, (dryPack, slug) => {
          if (!sails.helpers[slug]) {
            sails.hooks.helpers.furnishPack(slug, dryPack);
            return;
          } else {
            _.each(dryPack.defs, (def, identity) => {
              sails.hooks.helpers.furnishHelper(slug + '.' + identity, def);
            }); //∞
          } //ﬁ
        }); //∞
        /////////////////////////////////////////////////////////
      } catch (error) {
        return done(error);
      }

      return done();
    });
  };
};
