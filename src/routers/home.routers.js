const { Router } = require ('express');
const router = Router();
const homeCtrl = require('../controller/home.controller')

router.get('/home/:id_user', homeCtrl.getMyEvents)
router.get('/home/eventosComunidad/:id_user', homeCtrl.getEventsCommunity)

router.post('/home/detalleEvento', homeCtrl.postParticipacion)
router.delete('/home/abandonar', homeCtrl.deleteParticipacion)
router.get('/home/mejores/mazos', homeCtrl.getBestDecks)

router.get('/home/detalleEvento/:id_event', homeCtrl.getParticipantes)



module.exports = router;