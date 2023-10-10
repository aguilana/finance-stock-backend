// db/models/UserPortfolio.js

const { DataTypes } = require('sequelize');
import db from '../db';
const UserPortfolio = db.define('userPortfolio', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default UserPortfolio;
