const express = require('express')
const bodyParser = require('body-parser')
const rateLimite = require('express-rate-limit');
const authRouter = require('./routes/authRoutes');
const webhookRouter = require('./routes/webhookRoutes')
const publicationRouter = require('./routes/publicationRoutes')
const highlightsRoute = require("./routes/highlights")
const bookmarkRoutes = require("./routes/bookmark")
const noteRoutes = require("./routes/note")
const markRoutes = require('./routes/marks')
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
app.use("/api/highlights", highlightsRoute)
app.use("/api/bookmarks", bookmarkRoutes)
app.use("/notes",noteRoutes)
app.use('/api/marks',markRoutes)
app.listen(3000, ()=> console.log('server started'))
