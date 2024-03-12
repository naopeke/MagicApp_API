const { connection } =  require('../database');

const getDecks = async (req, res, next) => {
    try {
        console.log('get cards try');
    } catch {
        console.log('get cards catch');
    }
}

const editDeck = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}


const deleteDeck = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    getDecks,
    editDeck,
    deleteDeck
};