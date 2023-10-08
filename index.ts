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
      console.log(
        process.env.NODE_ENV === 'development'
          ? '--- dev mode ---'
          : '--- prod mode ---'
      );
      await db.sync();
      console.log('--- db synced ---');
    }
    // start listening (and create a 'server' object representing our server)
    console.log('--- db synced ---');
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

init();
