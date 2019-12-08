const pg = require('./src/datasources/pgconfig.datasource.config.json')
const join = require('path').join

// Application URL
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Postgresql URL
process.env.DBPG_BASE_URL = process.env.DBPG_BASE_URL || pg.url

// Token credentials
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'myjwts3cr3t'
process.env.TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '3600' // time in seconds

// Upload path
process.env.LOADING_ROUTE =
    process.env.LOADING_ROUTE || join(__dirname, '.uploads')
