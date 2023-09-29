// db/models/Stock.js

const { DataTypes } = require('sequelize');
import db from '../db';
const Stock = db.define('stock', {
  symbol: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Stock;
