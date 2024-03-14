const { pool } =  require('../database');
const axios = require('axios');

// router.get('/mis-mazos/:id_user', deckCtrl.getDecks);
// router.post('/mis-mazos', deckCtrl.addDeck);
// router.put('/mis-mazos/:nameDeck', deckCtrl.editDeckName);
// router.put('/mis-mazos', deckCtrl.editDeck);
// router.put('/mis-mazos/compartir', deckCtrl.shareDeck);


const getMyDecks = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const addMyDeck = async (req, res, next) => {
    try {
        console.log('add deck try');
    } catch {
        console.log('add deck catch');
    }
}

const editMyDeckName = async (req, res, next) => {
    try {
        console.log('edit deck name try');
    } catch {
        console.log('edit deck name catch');
    }
}

const editMyDeck = async (req, res, next) => {
    try {
        console.log('edit deck try');
    } catch {
        console.log('edit deck catch');
    }
}

const mySharedDeck = async (req, res, next) => {
    try {
        console.log('share deck try');
    } catch {
        console.log('share deck catch');
    }
}


module.exports = {
    getMyDecks,
    addMyDeck,
    editMyDeckName,
    editMyDeck,
    mySharedDeck
};