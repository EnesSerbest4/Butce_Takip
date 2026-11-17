const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kategoriAdi: { type: DataTypes.STRING, allowNull: false },
  tur: { type: DataTypes.ENUM('gelir', 'gider'), allowNull: false }
});

module.exports = Category;