const sequelize = require('../config/database');
const User = require('./User');
const Account = require('./Account');
const Category = require('./Category');
const Transaction = require('./Transaction');

User.hasMany(Account, { foreignKey: 'userId', onDelete: 'CASCADE' });
Account.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Transaction, { foreignKey: 'userId', onDelete: 'CASCADE' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

Account.hasMany(Transaction, { foreignKey: 'accountId', onDelete: 'CASCADE' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });

Category.hasMany(Transaction, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
  sequelize,
  User,
  Account,
  Category,
  Transaction
};