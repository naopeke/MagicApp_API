const { Router } = require ('express');
const router = Router();
const userCtrl = require('../controller/user.controller');
const cardCtrl = require('../controller/card.controller');
const deckCtrl = require('../controller/deck.controller');
const eventCtrl = require('../controller/event.controller');


router.get('/', (req, res) => {
    res.send('API DESPLEGADA');
});
// router.get('/', userCtrl.registerUser);


module.exports = router;