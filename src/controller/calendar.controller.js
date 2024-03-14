const { pool } =  require('../database');

const getAllEvents = async (req, res, next) => {
    try {
        console.log('get cards try');
    } catch {
        console.log('get cards catch');
    }
}

const addMyEvent = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

const editEventParticipation = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

const deleteMyEvent = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}
module.exports = {
    getAllEvents,
    addMyEvent,
    editEventParticipation,
    deleteMyEvent
};



// *NOTE - CALENDARIO
// router.get('/calendario, ) saber eventos tanto true como false en participation 
// router.post('/calendario, ) añadir evento indicando mi id_user
  // parametro de la funcion (id_user, Event) por body
// router.put('/calendario, ) modificar p<rticipacion del evento(pasar participation a false)
// router.delete('/calendario, ) eliminar evento solo mi id_user de loggin coincide con del creador