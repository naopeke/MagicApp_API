const express = require('express');
const cors = require('cors');
const routers = require('./routers/routers');
const calendarRouters = require('./routers/calendar.routers.js');
const cardRouters = require('./routers/card.routers');
const deckRouters = require('./routers/deck.routers');
const eventRouters = require('./routers/event.routers');
const exploreRouters = require('./routers/explore.routers');
const homeRouters = require('./routers/home.routers');
const profileRouters = require('./routers/profile.routers');
const userRouters = require('./routers/user.routers');
const errorHandling = require('./error/errorHandling');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routers);
app.use(calendarRouters);
app.use(cardRouters);
app.use(deckRouters);
app.use(eventRouters);
app.use(exploreRouters);
app.use(homeRouters);
app.use(profileRouters);
app.use(userRouters);
app.use(function (req, res, next){
    res.status(404).json({error:true, codigo: 404, message: 'Endpoint is not found'})
});

app.use(errorHandling);

module.exports = app;