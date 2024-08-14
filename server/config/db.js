const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'postgres',
//     password: 'postgresql',
//     port: 5432,
// })

//jfiefiehf

const a = " efje"
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
})

module.exports = pool;