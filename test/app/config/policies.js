module.exports.policies = {
  // General
  '*': 'is-authenticated',

  // Blueprints
  'user/find': 'is-authenticated',

  // Security
  'security/grant-csrf-token': true,

  // Controllers
  'public/*': true,
  'private/*': 'is-authenticated',
};
