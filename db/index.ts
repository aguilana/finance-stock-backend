// const db = require("./db");
import db from './db';
import User from './models/User';
import Transaction from './models/Transaction';
import HistoricalPrice from './models/HistoricalPrice';
import Stock from './models/Stock';
import UserPortfolio from './models/UserPortfolio';

// relations
// db/models/User.js
User.hasMany(Transaction, { foreignKey: 'userId' });

// db/models/Stock.js
Stock.hasMany(Transaction, { foreignKey: 'stockId' });
Stock.hasMany(HistoricalPrice, { foreignKey: 'stockId' });

User.belongsToMany(Stock, { through: UserPortfolio });
Stock.belongsToMany(User, { through: UserPortfolio });

UserPortfolio.belongsTo(User);
UserPortfolio.belongsTo(Stock);

export { db };
export { User, Transaction, HistoricalPrice, Stock, UserPortfolio };
