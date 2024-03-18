const { Router } = require ('express');
const router = Router();
const cardCtrl = require('../controller/card.controller');

router.get('/cartas', cardCtrl.fetchCardData);
router.get('/cartas/:index', cardCtrl.getDeckIdByIndex);
router.post('/cartas', cardCtrl.addCards);


module.exports = router;