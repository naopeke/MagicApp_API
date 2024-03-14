const { pool } =  require('../database');

const getSharedDecks = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

const getVotedDecks = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

const getDeckById = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    getSharedDecks,
    getVotedDecks,
    getDeckById
};



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA