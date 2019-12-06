const pg = require('./src/datasources/pgconfig.datasource.config.json')

// Application URL
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Postgresql URL
process.env.DBPG_BASE_URL = process.env.DBPG_BASE_URL || pg.url
