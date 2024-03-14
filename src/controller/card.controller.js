const { pool } =  require('../database');
const axios = require('axios');

const fetchCardData = async (req, res, next) => {
    if (req.query.cardName) {
        // GET https://api.scryfall.com/cards/named?fuzzy=aust+com  hay que cambiar espacio por '+'

        const cardName = req.query.cardName.split(' ').join('+');
        try {
            const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURI(cardName)}`);
            const cardData = {
                id: response.data.id,
                image_uris: response.data.image_uris.normal, 
                name: response.data.name,
                type_line: response.data.type_line,
                oracle_text: response.data.oracle_text,
                printed_text: response.data.printed_text,
                color_identity: response.data.color_identity,
                legalities: response.data.legalities.standard,
                legalities: response.data.legalities.future,
                legalities: response.data.legalities.historic,
                legalities: response.data.legalities.timeless,
                legalities: response.data.legalities.gladiator,
                legalities: response.data.legalities.pioneer,
                legalities: response.data.legalities.explorer,
                legalities: response.data.legalities.modern,
                legalities: response.data.legalities.legacy,
                legalities: response.data.legalities.pauper,
                legalities: response.data.legalities.vintage,
                legalities: response.data.legalities.penny,
                legalities: response.data.legalities.commander,
                legalities: response.data.legalities.oathbreaker,
                legalities: response.data.legalities.standardbrawl,
                legalities: response.data.legalities.brawl,
                legalities: response.data.legalities.alchemy,
                legalities: response.data.legalities.paupercommander,
                legalities: response.data.legalities.duel,
                legalities: response.data.legalities.oldschool,
                legalities: response.data.legalities.premodern,
                legalities: response.data.legalities.predh,
                set_name: response.data.set_name,
                set_type: response.data.set_type,
                prices: response.data.prices.eur
            };
            res.json(cardData); // mandar en formato json
        } catch (err) {
            console.log('Error fetching', err);
            res.status(500).send('Error in fetching card data');
        }
    } else {
        res.status(400).send('Card name is required');
    }
};

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//500 Internal Server Error
//400 Bad Request


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
    fetchCardData,
    addCards,
    deleteCards
};