module.exports = function (sails) {
  return {
    /**
     * Runs before every matching route.
     *
     * @param {Ref} req
     * @param {Ref} res
     * @param {Function} next
     */
    before: {
      '/*': {
        skipAssets: true,
        fn: async function (req, res, next) {
          if (sails.config.jwt.enableRequestHook) {
            try {
              // If something goes wrong then catch the error
              const loggedInUser = await sails.helpers.jwt.verify.with({
                req,
                res,
              });

              if (!loggedInUser) {
                // @TODO: Some additional tasks to logout the user
                sails.log.verbose(
                  'An empty user was received without throwing an error'
                );
                delete req.me;

                // Proceed as usual
                return next();
              }

              // Proceed as authenticated user
              req.me = loggedInUser;
            } catch (err) {
              // Tolerate authentication error because is user not logged
              sails.log.verbose(err.message);

              // Delete req.me is the configuration is defined
              // default true for compatibility
              if (sails.config.jwt.deleteMeIfLoginFails) {
                delete req.me;
              }
            } finally {
              return next();
            }
          } else {
            return next();
          }
        },
      },
    },
  };
};
