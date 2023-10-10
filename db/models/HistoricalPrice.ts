// db/models/HistoricalPrice.js

const { DataTypes } = require('sequelize');
import db from '../db';
const HistoricalPrice = db.define('historicalPrice', {
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  latestPrice: {
    type: DataTypes.FLOAT,
  },
  marketCap: {
    type: DataTypes.FLOAT,
  },
  open: {
    type: DataTypes.FLOAT,
    // allowNull: false,
  },
  close: {
    type: DataTypes.FLOAT,
    // allowNull: false,
  },
  high: {
    type: DataTypes.FLOAT,
    // allowNull: false,
  },
  low: {
    type: DataTypes.FLOAT,
    // allowNull: false,
  },
  volume: {
    type: DataTypes.INTEGER,
    // allowNull: false,
  },
  change: {
    type: DataTypes.FLOAT,
  },
  changePercent: {
    type: DataTypes.FLOAT,
  },
  changeOverTime: {
    type: DataTypes.FLOAT,
  },
  changeOverTimePercent: {
    type: DataTypes.FLOAT,
  },
  highestPrice: {
    type: DataTypes.FLOAT,
  },
});

export default HistoricalPrice;
