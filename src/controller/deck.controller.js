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


const deleteCard = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

const deleteAllCards = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    getDecks,
    editDeck,
    deleteCard,
    deleteAllCards
};