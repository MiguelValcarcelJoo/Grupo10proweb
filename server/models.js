import { DataTypes } from 'sequelize';
import { isDatabaseConfigured, sequelize } from './database.js';

export const Game = isDatabaseConfigured
  ? sequelize.define('Game', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'PC',
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Sin descripción',
      },
      imageUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Sin categoría',
      },
    }, {
      tableName: 'games',
    })
  : null;

export const User = isDatabaseConfigured
  ? sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
      },
    }, {
      tableName: 'users',
    })
  : null;
