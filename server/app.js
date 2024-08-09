const express = require('express')
const bodyParser = require('body-parser')
const authRouter = require('./routes/authRoutes');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', authRouter)

app.listen(3000, ()=> console.log('server started'))