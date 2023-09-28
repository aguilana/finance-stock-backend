// db/models/Stock.js

const { DataTypes } = require('sequelize');
const db = require('../db');

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

module.exports = Stock;