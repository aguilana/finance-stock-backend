// db/models/HistoricalPrice.js

const { DataTypes } = require('sequelize');
import db from '../db';
const HistoricalPrice = db.define('historicalPrice', {
  stockId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: 'stocks',
    //   key: 'id',
    // },
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  open: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  close: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  high: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  low: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  volume: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default HistoricalPrice;
