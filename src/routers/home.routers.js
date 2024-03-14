const { Router } = require ('express');
const router = Router();
const homeCtrl = require('../controller/home.controller')

router.get('/home/:id_user', homeCtrl.getMyEvents)
router.get('/home/eventosComunidad/:id_user', homeCtrl.getEventsCommunity)
router.post('/home/detalleEvento', homeCtrl.postParticipacion)
router.get('/home/mejores/mazos', homeCtrl.getBestDecks)



module.exports = router;