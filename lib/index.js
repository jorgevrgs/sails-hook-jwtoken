/**
 * sails-hook-jsonwebtoken
 *
 * @see https://github.com/sailshq/sails-hook-organics
 */

/**
 * Json Web Token JWT hook
 *
 * @param  {SailsApp} sails
 * @return {Dictionary} [hook definition]
 */
module.exports = function (sails) {
  return {
    /**
     * defaults
     *
     * The implicit configuration defaults merged into `sails.config` by this hook.
     *
     * @type {Dictionary}
     */
    defaults: require('./defaults'),

    /**
     * configure()
     *
     * @type {Function}
     */
    configure: function () {},

    initialize: require('./initialize')(sails),

    routes: require('./routes')(sails),
  };
};
