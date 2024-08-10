const express = require('express')
const bodyParser = require('body-parser')
const authRouter = require('./routes/authRoutes');
const webhookRouter = require('./routes/webhookRoutes')

const publicationRouter = require('./routes/publicationRoutes')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', authRouter)
app.use('/webhook', webhookRouter)
app.use('/api/publications', publicationRouter)

app.listen(3000, ()=> console.log('server started'))