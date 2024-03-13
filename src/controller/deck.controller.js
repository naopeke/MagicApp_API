const { connection } =  require('../database');

// router.get('/mis-mazos/:id_user', deckCtrl.getDecks);
// router.post('/mis-mazos', deckCtrl.addDeck);
// router.put('/mis-mazos/:nameDeck', deckCtrl.editDeckName);
// router.put('/mis-mazos', deckCtrl.editDeck);
// router.put('/mis-mazos/compartir', deckCtrl.shareDeck);


const getDecks = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const addDeck = async (req, res, next) => {
    try {
        console.log('add deck try');
    } catch {
        console.log('add deck catch');
    }
}

const editDeckName = async (req, res, next) => {
    try {
        console.log('edit deck name try');
    } catch {
        console.log('edit deck name catch');
    }
}

const editDeck = async (req, res, next) => {
    try {
        console.log('edit deck try');
    } catch {
        console.log('edit deck catch');
    }
}

const shareDeck = async (req, res, next) => {
    try {
        console.log('share deck try');
    } catch {
        console.log('share deck catch');
    }
}


module.exports = {
    getDecks,
    addDeck,
    editDeckName,
    editDeck,
    shareDeck
};