const db = require("./db");

const User = require("./models/User");
const Transaction = require("./models/Transaction");
const HistoricalPrice = require("./models/HistoricalPrice");
const Stock = require("./models/Stock");
const UserPortfolios = require("./models/UserPortfolios");

// relations
// db/models/User.js
User.hasMany(Transaction, { foreignKey: 'userId' });
User.hasMany(UserPortfolios, { foreignKey: 'userId' });

// db/models/Stock.js
Stock.hasMany(Transaction, { foreignKey: 'stockId' });
Stock.hasMany(HistoricalPrice, { foreignKey: 'stockId' });
Stock.hasMany(UserPortfolios, { foreignKey: 'stockId' });

module.exports = {
    db,
    models: {
        User,
        Transaction,
        HistoricalPrice,
        Stock,
        UserPortfolios
    },
};