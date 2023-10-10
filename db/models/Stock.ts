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
  // latestPrice: {
  //   type: DataTypes.FLOAT,
  //   // allowNull: false,
  // },
  // marketCap: {
  //   type: DataTypes.FLOAT,
  // },
  // volume: {
  //   type: DataTypes.FLOAT,
  // },
  // open: {
  //   type: DataTypes.FLOAT,
  // },
  // close: {
  //   type: DataTypes.FLOAT,
  // },
  // high: {
  //   type: DataTypes.FLOAT,
  // },
  // low: {
  //   type: DataTypes.FLOAT,
  // },
  // change: {
  //   type: DataTypes.FLOAT,
  // },
  // changePercent: {
  //   type: DataTypes.FLOAT,
  // },
  // changeOverTime: {
  //   type: DataTypes.FLOAT,
  // },
  // changeOverTimePercent: {
  //   type: DataTypes.FLOAT,
  // },
  // highestPrice: {
  //   type: DataTypes.FLOAT,
  // },
});

export default Stock;
