const { Router } = require ('express');
const router = Router();
const exploreCtrl = require('../controller/explore.controller');


router.get('/explora/votados', exploreCtrl.getVotedDecks);
router.get('/explora', exploreCtrl.getSharedDecks);
router.get('/explora/search', exploreCtrl.getDeck)
router.put('/explora/mediaScore', exploreCtrl.putMediaScore)
router.get('/explora/deck', exploreCtrl.getDeckById);



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA

module.exports = router;