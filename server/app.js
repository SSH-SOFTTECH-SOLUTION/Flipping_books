const express = require('express')
const bodyParser = require('body-parser')
const rateLimite = require('express-rate-limit');
const authRouter = require('./routes/authRoutes');
const webhookRouter = require('./routes/webhookRoutes')
const publicationRouter = require('./routes/publicationRoutes')

const app = express();

const limiter = rateLimite({
    max: 50,
    windowMs: 60*1000,
    message: 'to many request'
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/testLimit', limiter, (req, res) => res.send({message: 'success'}));
app.use('/api/auth', authRouter)
app.use('/api/webhook', webhookRouter)
app.use('/api/publications', publicationRouter)

app.listen(3000, ()=> console.log('server started'))