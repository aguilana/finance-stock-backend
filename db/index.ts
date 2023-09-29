// const db = require("./db");
import db from './db';
import User from './models/User';
import Transaction from './models/Transaction';
import HistoricalPrice from './models/HistoricalPrice';
import Stock from './models/Stock';
import UserPortfolios from './models/UserPortfolios';

// relations
// db/models/User.js
User.hasMany(Transaction, { foreignKey: 'userId' });
User.hasMany(UserPortfolios, { foreignKey: 'userId' });

// db/models/Stock.js
Stock.hasMany(Transaction, { foreignKey: 'stockId' });
Stock.hasMany(HistoricalPrice, { foreignKey: 'stockId' });
Stock.hasMany(UserPortfolios, { foreignKey: 'stockId' });

export { db };
export { User, Transaction, HistoricalPrice, Stock, UserPortfolios };
// module.exports = {
//   db,
//   models: {
//     User,
//     Transaction,
//     HistoricalPrice,
//     Stock,
//     UserPortfolios,
//   },
// };
