const { Router } = require ('express');
const router = Router();
const eventCtrl = require('../controller/event.controller');

// router.get('/eventos', eventCtrl.getAllEvents);

// router.get('/eventos/?:id_user', eventCtrl.getEventByIdUser);
// router.get('/eventos/??????, eventCtrl.getEventByIdUser); filtro para que aparece solo los eventos que NO son creados por el usuario


// router.post('/eventos/?:id_user', eventCtrl.addEvent);

// router.put('/eventos/?:id_user', eventCtrl.editEvent);

// router.delete('/eventos/?:id_user', eventCtrl.deleteEvent);