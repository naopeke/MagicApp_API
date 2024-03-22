const { Router } = require ('express');
const router = Router();
const calendarCtrl = require('../controller/calendar.controller');

router.get('/calendario/:id_user', calendarCtrl.getAllUserEvents);

router.get('/calendario/:id_user/:date', calendarCtrl.getUserEventsForDate);

// router.post('/calendario', calendarCtrl.addMyEvent);

// router.put('/calendario', calendarCtrl.editEventParticipation);

// router.delete('/calendario', calendarCtrl.deleteMyEvent);



// *NOTE - CALENDARIO
// router.get('/calendario, ) saber eventos tanto true como false en participation 
// router.post('/calendario, ) añadir evento indicando mi id_user
  // parametro de la funcion (id_user, Event) por body


module.exports = router;