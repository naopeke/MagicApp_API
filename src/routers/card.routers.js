const { Router } = require ('express');
const router = Router();
const cardCtrl = require('../controller/card.controller');

router.get('/cartas', cardCtrl.fetchCardData);
router.post('/cartas', cardCtrl.addCardsToDeck);


module.exports = router;