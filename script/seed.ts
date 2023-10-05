import { db } from '../db';
import User from '../db/models/User';
import Stock from '../db/models/Stock';
import Transaction from '../db/models/Transaction';
import HistoricalPrice from '../db/models/HistoricalPrice';
import UserPortfolio from '../db/models/UserPortfolio';

// Dummy data
const users = [
  { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
];

const stocks = [{ symbol: 'AAPL', name: 'Apple Inc.' }];

const transactions = [
  {
    userId: 1,
    stockId: 1,
    transactionType: 'buy',
    quantity: 5,
    priceAtTransaction: 150,
  },
];

const historicalPrices = [
  {
    stockId: 1,
    date: new Date(),
    open: 150,
    close: 155,
    high: 157,
    low: 148,
    volume: 100000,
  },
];

const userPortfolio = [{ userId: 1, stockId: 1, quantity: 5 }];

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  console.log('DB', db);
  await db.sync({ force: true }); // clears db and matches models to tables

  await Promise.all(users.map((user) => User.create(user)));
  await Promise.all(stocks.map((stock) => Stock.create(stock)));
  await Promise.all(
    transactions.map((transaction) => Transaction.create(transaction))
  );
  await Promise.all(
    historicalPrices.map((price) => HistoricalPrice.create(price))
  );
  await Promise.all(
    userPortfolio.map((portfolio) => UserPortfolio.create(portfolio))
  );

  console.log('get all the magic methods---');
  console.log(Object.keys(User.prototype));
  console.log(Object.keys(Transaction.prototype));
  console.log('db synced!');
}

/*
   We've separated the `seed` function from the `runSeed` function.
   This way we can isolate the error handling and exit trapping.
   The `seed` function is concerned only with modifying the database.
  */
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
    Execute the `seed` function, IF we ran this module directly (`node seed`).
    `Async` functions always return a promise, so we can use `catch` to handle
    any errors that might occur inside of `seed`.
  */
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
