module.exports.policies = {
  '*': 'is-authenticated',
  'security/grant-csrf-token': true,
  'public/*': true,
};
