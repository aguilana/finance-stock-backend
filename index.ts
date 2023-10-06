const PORT = process.env.PORT || 8080;
const app = require('./app');
const { db } = require('./db');
import { seed, runSeed } from './script/seed';
import { seedAdmin } from './script/seedAdmin';
console.log('seed?', process.env.SEED);
const init = async () => {
  try {
    if (process.env.SEED === 'true') {
      console.log('Seeding database');
      await seed();
    } else {
      // force true for development
      if (process.env.NODE_ENV !== 'development') {
        await db.sync();
      } else {
        console.log('in development mode');
        await db.sync();
      }
    }
    // start listening (and create a 'server' object representing our server)
    console.log('--- db synced ---');
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();
