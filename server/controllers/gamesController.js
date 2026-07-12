import { Op } from 'sequelize';
import { Game, User } from '../models.js';
import { isDatabaseConfigured } from '../database.js';
import { games, users } from '../data/mockData.js';

// Estado en memoria (persiste mientras el servidor esté corriendo)
let gamesDB = [...games];
let usersDB = [...users];

const normalizeGame = (game) => {
  const plainGame = typeof game?.toJSON === 'function' ? game.toJSON() : game;
  if (!plainGame) return null;
  return {
    ...plainGame,
    price: Number(plainGame.price),
  };
};

const filterGamesInMemory = ({ platform, category, search, minPrice, maxPrice }) => {
  let result = [...gamesDB];

  if (platform && platform !== 'all') {
    result = result.filter((game) => game.platform === platform);
  }
  if (category && category !== 'all') {
    result = result.filter((game) => game.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((game) =>
      game.title.toLowerCase().includes(q) ||
      (game.category && game.category.toLowerCase().includes(q)) ||
      (game.description && game.description.toLowerCase().includes(q))
    );
  }
  if (minPrice) result = result.filter((game) => game.price >= parseFloat(minPrice));
  if (maxPrice) result = result.filter((game) => game.price <= parseFloat(maxPrice));

  return result;
};

const buildGameFilters = ({ platform, category, search, minPrice, maxPrice }) => {
  const where = {};

  if (platform && platform !== 'all') {
    where.platform = platform;
  }
  if (category && category !== 'all') {
    where.category = category;
  }
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }

  return where;
};

const buildGamePayload = ({ title, platform, price, description, imageUrl, category }) => ({
  title,
  platform: platform || 'PC',
  price: parseFloat(price),
  description: description || 'Sin descripción',
  imageUrl: imageUrl || `https://placehold.co/600x900/1e293b/ffffff?text=${encodeURIComponent(title)}`,
  category: category || 'Sin categoría',
});

// ─── GAMES ────────────────────────────────────────────────────────────────────

export const getAllGames = async (req, res) => {
  try {
    if (!isDatabaseConfigured) {
      return res.json(filterGamesInMemory(req.query));
    }

    const result = await Game.findAll({
      where: buildGameFilters(req.query),
      order: [['id', 'ASC']],
    });

    return res.json(result.map(normalizeGame));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudieron obtener los juegos.', detail: error.message });
  }
};

export const getGameById = async (req, res) => {
  try {
    if (!isDatabaseConfigured) {
      const game = gamesDB.find((item) => item.id === parseInt(req.params.id));
      if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });
      return res.json(game);
    }

    const game = await Game.findByPk(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });
    return res.json(normalizeGame(game));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo obtener el juego.', detail: error.message });
  }
};

export const createGame = async (req, res) => {
  const { title, platform, price, description, imageUrl, category } = req.body;
  if (!title || !price) {
    return res.status(400).json({ message: 'Título y precio son requeridos.' });
  }

  try {
    if (!isDatabaseConfigured) {
      const newGame = {
        id: Date.now(),
        ...buildGamePayload({ title, platform, price, description, imageUrl, category }),
      };
      gamesDB.unshift(newGame);
      return res.status(201).json(newGame);
    }

    const createdGame = await Game.create(
      buildGamePayload({ title, platform, price, description, imageUrl, category })
    );

    return res.status(201).json(normalizeGame(createdGame));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo crear el juego.', detail: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, platform, price, description, imageUrl, category } = req.body;

    if (!isDatabaseConfigured) {
      const index = gamesDB.findIndex((game) => game.id === id);
      if (index === -1) return res.status(404).json({ message: 'Juego no encontrado.' });

      gamesDB[index] = {
        ...gamesDB[index],
        title: title ?? gamesDB[index].title,
        platform: platform ?? gamesDB[index].platform,
        price: price !== undefined ? parseFloat(price) : gamesDB[index].price,
        description: description ?? gamesDB[index].description,
        imageUrl: imageUrl ?? gamesDB[index].imageUrl,
        category: category ?? gamesDB[index].category,
      };

      return res.json(gamesDB[index]);
    }

    const game = await Game.findByPk(id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado.' });

    game.title = title ?? game.title;
    game.platform = platform ?? game.platform;
    game.price = price !== undefined ? parseFloat(price) : game.price;
    game.description = description ?? game.description;
    game.imageUrl = imageUrl ?? game.imageUrl;
    game.category = category ?? game.category;

    await game.save();

    return res.json(normalizeGame(game));
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo actualizar el juego.', detail: error.message });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!isDatabaseConfigured) {
      const index = gamesDB.findIndex((game) => game.id === id);
      if (index === -1) return res.status(404).json({ message: 'Juego no encontrado.' });
      gamesDB.splice(index, 1);
      return res.json({ message: 'Juego eliminado correctamente.' });
    }

    const deletedRows = await Game.destroy({ where: { id } });
    if (deletedRows === 0) return res.status(404).json({ message: 'Juego no encontrado.' });

    return res.json({ message: 'Juego eliminado correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo eliminar el juego.', detail: error.message });
  }
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos.' });
  }

  try {
    if (!isDatabaseConfigured) {
      const user = usersDB.find((item) => item.email === email && item.password === password);
      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas.' });
      }

      const userSafe = { ...user };
      delete userSafe.password;
      return res.json({ user: userSafe });
    }

    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const userSafe = user.toJSON();
    delete userSafe.password;
    return res.json({ user: userSafe });
  } catch (error) {
    return res.status(500).json({ message: 'No se pudo iniciar sesión.', detail: error.message });
  }
};

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

export const checkout = (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío.' });
  }

  const itemsWithKeys = items.map(item => {
    const randomKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      ...item,
      keyGenerated: `${randomKey.slice(0, 4)}-${randomKey.slice(4, 8)}`,
      purchaseDate: new Date().toLocaleDateString('es-PE'),
    };
  });

  res.json({ success: true, purchasedItems: itemsWithKeys });
};
