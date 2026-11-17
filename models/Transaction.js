const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  miktar: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  aciklama: { type: DataTypes.STRING },
  tarih: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Transaction;