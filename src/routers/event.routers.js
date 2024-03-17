const { Router } = require ('express');
const router = Router();
const eventCtrl = require('../controller/event.controller');

router.get('/eventos', eventCtrl.getAllEvents);

router.get('/eventos/?:id_user', eventCtrl.getMyEvents);

router.get('/eventos/?:id_event', eventCtrl.getMyEvents);

// router.get('/eventos/', eventCtrl.getOthersEvents); // hay que cambiar endpoint

router.post('/eventos', eventCtrl.addMyEvent);

router.put('/eventos', eventCtrl.editMyEvent);

router.put('/eventos/detalle', eventCtrl.editParticipation);
//belu

router.delete('/eventos', eventCtrl.deleteMyEvent);




// *NOTE - EVENTOS
// router.get('/eventos, ) aparezcan todos los eventos
// router.get('/eventos/?id_user, ) filtro para que aparezcan solo los eventos del usuario
// router.get('/eventos/??????, ) filtro para que aparezcan solo los eventos que NO son creados por el usuario

// router.post('/eventos, ) añadir evento con el id_user del logging
// router.put('/eventos, ) editar evento solo mi id_user de loggin coincide con del creador
//router.put('/eventos/detalle', eventCtrl.editParticipation);  editar participacion boleano  Belu
// router.delete('/eventos, ) eliminar evento solo mi id_user de loggin coincide con del creador

module.exports = router;