import { db } from '../db';
import User from '../db/models/User';
import Stock from '../db/models/Stock';
import Transaction from '../db/models/Transaction';
import HistoricalPrice from '../db/models/HistoricalPrice';
import UserPortfolio from '../db/models/UserPortfolio';
import { generatePrices } from './dataGenerator';
import { seedAdmin } from './seedAdmin';
import admin from '../services/firebaseAdmin';

async function seedUsers(users: any[]) {
  for (let user of users) {
    try {
      let regUser = await User.findOne({ where: { email: user.email } });
      // console.log(`Successfully created user with ID: ${regUser.firebaseUID}`);

      if (!regUser) {
        console.log('no user so creating user from firebase email');
        const createdUser = await admin.auth().getUserByEmail(user.email);

        if (!createdUser) {
          console.error(`No user found in Firebase for email: ${user.email}`);
          return;
        }
        console.log('REG USER CREATED ----->', createdUser);

        const firebaseUID = createdUser.uid; // Fetch this from your Firebase authentication system
        const firstName = user.firstName || 'Test';
        const lastName = user.lastName || 'Test';
        const displayName = `${firstName} ${lastName}`;

        regUser = await User.create({
          // id: user.id,
          email: user.email,
          firebaseUID,
          firstName,
          lastName,
          displayName,
          isAdmin: user.isAdmin,
        });

        console.log('User created and seeded successfully ------>', regUser);
      } else {
        console.log('User already exists.', regUser);
        regUser.displayName = user.displayName;
        await regUser.save();
      }
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    }
  }
}

// Dummy data
const users = [
  {
    firstName: process.env.ADMIN_FIRST_NAME || 'Nick',
    lastName: process.env.ADMIN_LAST_NAME || 'Aguila',
    email: process.env.ADMIN_EMAIL || '',
    isAdmin: true,
  },
  {
    firstName: 'Sarah',
    lastName: 'Doe',
    email: 'sarah@example.com',
    isAdmin: false,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    isAdmin: false,
  },
];

const stocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'FB', name: 'Facebook Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'NVDA', name: 'Nvidia Corporation' },
];

const transactions = [
  {
    userId: 2,
    stockId: 1,
    transactionType: 'buy',
    quantity: 10,
    priceAtTransaction: 150,
  },
  {
    userId: 2,
    stockId: 2,
    transactionType: 'buy',
    quantity: 15,
    priceAtTransaction: 300,
  },
  {
    userId: 2,
    stockId: 4,
    transactionType: 'buy',
    quantity: 5,
    priceAtTransaction: 700,
  },
  {
    userId: 3,
    stockId: 3,
    transactionType: 'buy',
    quantity: 8,
    priceAtTransaction: 3300,
  },
  {
    userId: 3,
    stockId: 5,
    transactionType: 'buy',
    quantity: 7,
    priceAtTransaction: 2500,
  },
  {
    userId: 3,
    stockId: 6,
    transactionType: 'buy',
    quantity: 20,
    priceAtTransaction: 280,
  },
];

const historicalPrices = [
  ...generatePrices(1, 150), // Apple
  ...generatePrices(2, 300), // Facebook
  ...generatePrices(3, 3300), // Amazon
  ...generatePrices(4, 700), // Tesla
  ...generatePrices(5, 2500), // Alphabet
  ...generatePrices(6, 280), // Microsoft
  ...generatePrices(7, 200), // Nvidia
];

const userPortfolio = [
  { userId: 1, stockId: 1, quantity: 10 },
  { userId: 1, stockId: 2, quantity: 15 },
  { userId: 1, stockId: 4, quantity: 5 },
  { userId: 2, stockId: 3, quantity: 8 },
  { userId: 2, stockId: 5, quantity: 7 },
  { userId: 2, stockId: 6, quantity: 20 },
];

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
