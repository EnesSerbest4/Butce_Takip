const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  kategoriAdi: { type: DataTypes.STRING, allowNullable: false }, // örn: "Mutfak", "Kira", "Maaş"
  tur: { type: DataTypes.ENUM('gelir', 'gider'), allowNullable: false }
});

module.exports = Category;