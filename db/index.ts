// const db = require("./db");
import db from './db';
import User from './models/User';
import Transaction from './models/Transaction';
import HistoricalPrice from './models/HistoricalPrice';
import Stock from './models/Stock';
import UserPortfolio from './models/UserPortfolio';

// relations
User.belongsToMany(Stock, {
  as: 'clientPortfolio',
  through: UserPortfolio,
  foreignKey: 'userId',
  otherKey: 'stockId',
});
Stock.belongsToMany(User, {
  as: 'clientPortfolio',
  through: UserPortfolio,
  foreignKey: 'stockId',
  otherKey: 'userId',
});

// db/models/User.js
User.hasMany(Transaction);
Transaction.belongsTo(User);

// db/models/Stock.js
Stock.hasMany(Transaction);
Transaction.belongsTo(Stock);

Stock.hasMany(HistoricalPrice);
HistoricalPrice.belongsTo(Stock);

// User.hasMany(UserPortfolio);
// UserPortfolio.belongsTo(User);

// Stock.hasMany(UserPortfolio);
// UserPortfolio.belongsTo(Stock);

export { db };
export { User, Transaction, HistoricalPrice, Stock, UserPortfolio };
