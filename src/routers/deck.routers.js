const { Router } = require ('express');
const router = Router();
const deckCtrl = require('../controller/deck.controller');

router.get('/mis-mazos/:id_user', deckCtrl.getMyDecksWithData);

router.put('/mis-mazos/:id_deck', deckCtrl.editMyDeckName);

router.put('/mis-mazos/cantidad/:id_deckCard', deckCtrl.updateCardQuantity);

router.put('/mis-mazos/compartir/:id_deck', deckCtrl.mySharedDeck);


module.exports = router;