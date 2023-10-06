import { db } from '../db';
import Stock from '../db/models/Stock';
import Transaction from '../db/models/Transaction';
import HistoricalPrice from '../db/models/HistoricalPrice';
import UserPortfolio from '../db/models/UserPortfolio';

import {
  seedUsers,
  users,
  stocks,
  transactions,
  historicalPrices,
  userPortfolio,
} from './seedUsers';

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  // console.log('DB', db);
  await db.sync({ force: true }); // clears db and matches models to tables
  await seedUsers(users);

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
    // await seedAdmin();
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
// if (module === require.main) {
//   runSeed();
// }

// we export the seed function for testing purposes (see `./seed.spec.js`)
export { seed, runSeed };
