import { sequelize, isDatabaseConfigured } from '../database.js';
import { Game, User } from '../models.js';
import { games, users } from './mockData.js';

const syncOptions = {
  alter: process.env.DB_SYNC_ALTER === 'true',
  force: process.env.DB_SYNC_FORCE === 'true',
};

export const syncAndSeedDatabase = async () => {
  if (!isDatabaseConfigured) return;

  await sequelize.sync(syncOptions);

  const gamesCount = await Game.count();
  if (gamesCount === 0) {
    await Game.bulkCreate(games);
  }

  const usersCount = await User.count();
  if (usersCount === 0) {
    await User.bulkCreate(users);
  }
};
