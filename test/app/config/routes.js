module.exports.routes = {
  'GET /api/v1/csrf-token': { action: 'security/grant-csrf-token' },
  'POST /api/v1/login': { action: 'public/login' },
  'POST /api/v1/account': { action: 'private/account' },
};
