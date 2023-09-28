const Sequelize = require("sequelize");
const pkg = require("../package.json");
require("dotenv").config();

const databaseName =
    pkg.name + (process.env.NODE_ENV === "development" ? "-test" : "");

const config = {
    logging: false,
};

if (process.env.LOGGING === "true") {
    delete config.logging;
}

let db;

if (process.env.NODE_ENV === "production") {
    if (process.env.HEROKU_POSTGRESQL_OLIVE_URL) {
        db = new Sequelize(
            process.env.HEROKU_POSTGRESQL_OLIVE_URL,
            {
                ...config,
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                },
            }
        );
    } else {
        db = new Sequelize(process.env.DATABASE_URL, config);
    }
} else {
    db = new Sequelize(
        `${process.env.LOCAL_DATABASE_URL}${databaseName}`,
        config
    );
}

module.exports = db;