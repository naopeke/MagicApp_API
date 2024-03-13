const { Router } = require ('express');
const router = Router();
const exploraCtrl = require('../controller/explora.controller');

router.get('/explora', exploraCtrl.getSharedDecks);

router.get('/explora/votados', exploraCtrl.getVotedDecks);

router.get('/explora/:id_deck', exploraCtrl.getDeckById);



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA