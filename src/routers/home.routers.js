const { Router } = require ('express');
const router = Router();
const homeCtrl = require('../controller/home.controller')

router.get('/home/:id_user', homeCtrl.getMyEvents)
router.get('/home/eventosComunidad/:id_user', homeCtrl.getEventsCommunity)
router.put('/home/detailEvent', homeCtrl.putParticipacion)
router.get('/home/mazos/votados', homeCtrl.getBestDecks)



module.exports = router;