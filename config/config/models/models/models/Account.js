const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hesapAdi: { type: DataTypes.STRING, allowNullable: false }, // örn: "Ziraat Bankası", "Nakit"
  bakiye: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
});

module.exports = Account;