// db/models/User.js

const Sequelize = require('sequelize');
const { STRING } = Sequelize;
import db from '../db';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
import CustomError from '../../utils/customError';

const SALT_ROUNDS = 5;

interface UserAttributes {
  email: string;
  password: string;
}

const User = db.define('user', {
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
});

export default User;
// module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd: string) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.userId }, process.env.JWT);
};

// generate cookie with token
User.prototype.generateCookie = function () {
  return jwt.sign({ id: this.userId }, process.env.JWT, {
    expiresIn: 259200, // expires in 3 days
  });
};

/**
 * classMethods
 */
User.authenticate = async function ({ email, password }: UserAttributes) {
  const user = await this.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password))) {
    throw new CustomError('Unable to authenticate', 401);
  }
  return user.generateToken();
};

User.authenticateAdmin = async function ({ email, password }: UserAttributes) {
  const user = await this.findOne({ where: { email } });
  if (!user || !(await user.correctPassword(password)) || !user.isAdmin) {
    throw new CustomError('Unable to authenticate', 401);
  }
  return user.generateToken();
};

User.findByToken = async function (token: string) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);

    const user = User.findByPk(id);
    if (!user) {
      throw 'nooo';
    }
    return user;
  } catch (ex) {
    throw new CustomError('bad token', 401);
  }
};

// social authentication
User.authenticateViaSocial = async function (passportId: string) {
  try {
    const user = await this.findOne({ where: { passportId } });
    if (!user) {
      throw new CustomError('no users exist', 401);
    }
    return user.generateToken();
  } catch (ex) {
    throw new CustomError('bad token', 401);
  }
};

/**
 * hooks
 */
const hashPassword = async (user: typeof User) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users = []) => Promise.all(users.map(hashPassword)));
