const { Router } = require ('express');
const router = Router();
const cardCtrl = require('../controller/card.controller');

router.get('/cartas', cardCtrl.fetchCardData);
router.get('/cartas/:user_id/:indexDeck', cardCtrl.getDeckIdByUserAndIndex);
router.get('/cartas:user_id', cardCtrl.checkCardExists);
// router.post('/cartas', cardCtrl.addCards);


module.exports = router;