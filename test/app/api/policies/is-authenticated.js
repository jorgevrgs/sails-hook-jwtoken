/**
 * is-authenticated
 *
 * A simple policy that allows any request from an authenticated user.
 *
 * For more about how to use policies, see:
 *   https://sailsjs.com/config/policies
 *   https://sailsjs.com/docs/concepts/policies
 *   https://sailsjs.com/docs/concepts/policies/access-control-and-permissions
 */

module.exports = async function (req, res, proceed) {
  sails.log.verbose('Accessing policies at policies/is-authenticated.js', {
    me: req.me,
  });

  if (req.me) {
    return proceed();
  }

  return res.forbidden();
};
