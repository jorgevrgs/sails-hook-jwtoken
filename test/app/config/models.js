module.exports.models = {
  schema: true,
  migrate: 'drop',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },
    id: { type: 'number', autoIncrement: true },
  },
  dataEncryptionKeys: {
    default: 'ifh09320js0d9ud09asjd0asc0=09as0dasd9asdasd0',
  },
  cascadeOnDestroy: true,
};
