const { connection } =  require('../database');
const axios = require('axios');

const fetchCardData = async (req, res, next) => {
    try {
        const response = await axios.get('https://api.scryfall.com/cards/named?fuzzy=aust+com')
        console.log('get cards try');
    } catch {
        console.log('get cards catch');
    }
}

const addCards = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}


const deleteCards = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    getCards,
    addCards,
    deleteCards
};