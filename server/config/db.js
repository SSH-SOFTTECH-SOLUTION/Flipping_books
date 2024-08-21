const { Pool } = require('pg')
const dotenv = require('dotenv')
dotenv.config()

// const pool = new Pool({
    // database: "osborne_books",
    // user: 'postgres',
    // host: 'localhost',
    // database: 'postgres',
    // password: 'Amit@123',
    // port: 5432,
// })

//jfiefiehf

const a = " efje"
const pool = new Pool({
      database: "osborne_books",
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Amit@123',
    port: 5432,
    connectionString: process.env.POSTGRES_URL,
})

module.exports = pool;