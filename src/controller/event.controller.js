const { pool } =  require('../database');

const getAllEvents = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const getMyEvents = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const getOthersEvents = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const addMyEvent = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const editMyEvent = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const editParticipation = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const deleteMyEvent = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}


// *NOTE - EVENTOS
// router.get('/eventos, ) aparezcan todos los eventos
// router.get('/eventos/?id_user, ) filtro para que aparezcan solo los eventos del usuario
// router.get('/eventos/??????, ) filtro para que aparezcan solo los eventos que NO son creados por el usuario

// router.post('/eventos, ) añadir evento con el id_user del logging
// router.put('/eventos, ) editar evento solo mi id_user de loggin coincide con del creador
// router.delete('/eventos, ) eliminar evento solo mi id_user de loggin coincide con del creador


module.exports = {
    getAllEvents,
    getMyEvents,
    getOthersEvents,
    addMyEvent,
    editMyEvent,
    editParticipation,
    deleteMyEvent
};