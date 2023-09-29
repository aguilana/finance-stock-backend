// db/models/Transaction.js

const { DataTypes } = require('sequelize');
import db from '../db';
const Transaction = db.define('transaction', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // 'users' refers to the table name
      key: 'id',
    },
    allowNull: false,
  },
  stockId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'stocks', // 'stocks' refers to the table name
      key: 'id',
    },
    allowNull: false,
  },
  transactionType: {
    type: DataTypes.ENUM('buy', 'sell'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  priceAtTransaction: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Transaction;
