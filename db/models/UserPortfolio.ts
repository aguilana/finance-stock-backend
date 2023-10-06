// db/models/UserPortfolio.js

const { DataTypes } = require('sequelize');
import db from '../db';
const UserPortfolio = db.define('userPortfolio', {
  userId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: 'users',
    //   key: 'id',
    // },
    allowNull: false,
  },
  stockId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: 'stocks',
    //   key: 'id',
    // },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default UserPortfolio;
