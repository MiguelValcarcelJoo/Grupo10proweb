# PeKeys Store

Proyecto full-stack unificado en una sola carpeta. El frontend vive en React + Vite, el backend en Express, y ahora el servidor también está preparado para conectarse a PostgreSQL siguiendo la guía de Azure.

## Estructura

```text
PWP/
├── public/                 # Archivos estáticos del frontend
├── src/                    # Aplicación React
├── server/
│   ├── controllers/        # Lógica de endpoints
│   ├── data/               # Datos mock y seed inicial
│   ├── routes/             # Rutas Express
│   ├── database.js         # Conexión PostgreSQL
│   ├── models.js           # Modelos Sequelize
│   └── index.js            # Servidor Express + frontend compilado
├── .env.example            # Variables de entorno base
├── eslint.config.js
├── index.html
├── package.json            # Dependencias y scripts del proyecto completo
└── vite.config.js
```

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Esto levanta:

- frontend Vite en `http://localhost:5173`
- backend Express en `http://localhost:3000`

También puedes levantar cada parte por separado:

```bash
npm run dev:client
npm run dev:server
```

## Producción

```bash
npm run build
npm run start
```

En producción, `server/index.js` sirve el contenido de `dist/` además de la API.

## Variables de entorno

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
DB_HOST=
DB_PORT=5432
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_SSL=true
DB_LOGGING=false
DB_SYNC_ALTER=false
DB_SYNC_FORCE=false
```

## Base de datos

- Si defines `DB_HOST`, `DB_NAME`, `DB_USER` y `DB_PASSWORD`, la app usa PostgreSQL mediante Sequelize.
- Si no defines esas variables, el backend sigue funcionando en modo memoria para no bloquear el desarrollo.
- Al conectarse a PostgreSQL, el servidor crea las tablas necesarias y si están vacías inserta los juegos y usuarios de prueba.
- La conexión usa SSL compatible con Azure cuando `DB_SSL=true`.

## Usuarios iniciales

- `admin@pekeys.com` / `admin123`
- `usuario1@pekeys.com` / `pass123`

## Guía rápida para Azure

1. Crear el grupo de recursos.
2. Crear `Azure Database for PostgreSQL Flexible Server`.
3. Crear una base de datos dentro del servidor PostgreSQL.
4. Crear una `Web App` para Node.js.
5. Conectar la Web App con tu repositorio GitHub desde `Centro de implementación`.
6. Configurar en la Web App las variables:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
DB_SSL=true
FRONTEND_URL=https://TU-DOMINIO.azurewebsites.net
PORT=8080
```

7. Desplegar desde GitHub y verificar:

```text
https://TU-DOMINIO.azurewebsites.net/api/health
```

Si todo está bien, el endpoint debe responder con `status: ok` y `storage: postgres`.
