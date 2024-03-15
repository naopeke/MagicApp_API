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
                printed_name: response.data.printed_name,
                type_line: response.data.type_line,
                oracle_text: response.data.oracle_text,
                printed_text: response.data.printed_text,
                color_identity: response.data.color_identity,
                legalities: response.data.legalities,
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



// const fetchCollectiondData = async (req, res, next) => {
//     if (req.query.cardName) {
//         // GET https://api.scryfall.com/cards/named?fuzzy=aust+com  hay que cambiar espacio por '+'

//         const cardName = req.query.cardName.split(' ').join('+');
//         try {
//             const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURI(cardName)}`);
//             const cardData = {
//                 id: response.data.id,
//                 image_uris: response.data.image_uris.normal, 
//                 name: response.data.name,
//                 type_line: response.data.type_line,
//                 oracle_text: response.data.oracle_text,
//                 printed_text: response.data.printed_text,
//                 color_identity: response.data.color_identity,
//                 legalities: response.data.legalities,
//                 set_name: response.data.set_name,
//                 set_type: response.data.set_type,
//                 prices: response.data.prices.eur
//             };
//             res.json(cardData); // mandar en formato json
//         } catch (err) {
//             console.log('Error fetching', err);
//             res.status(500).send('Error in fetching card data');
//         }
//     } else {
//         res.status(400).send('Card name is required');
//     }
// };

// POST /api/mis-mazos/{deckId}/cards

//
const addCards = async (req, res, next) => {

    const { id_deck, id:id_card_api } = req.body;  // definir id como id_card_api para entender mejor

    try {
        // buscar si existe la misma carta
        let cardExist = 'SELECT id_card FROM magydeck.card WHERE id_card_api = ?';
        console.log(cardExist);
        const [cardExistResult] = await pool.query(cardExist, [id_card_api]);
        console.log(cardExistResult);

        // si no existe, añadir como la nueva carta
        if (cardExist.length === 0){
            let insertCard = 'INSERT INTO magydeck.card (id_card_api) VALUES(?)';
            console.log(insertCard);
            const [insertCardResult] = await pool.query(insertCard, [id_card_api]);
            console.log(insertCardResult);
        } else {
            //si existe, +1 cantidad
            let addQuantity = 'UPDATE magydeck.card SET quantity = quantity + 1 WHERE id_card_api = ?';
            console.log(addQuantity);
            const [addQuantityResult] = await pool.query(addQuantity, [id_card_api]);
            console.log(addQuantityResult);
        }


        // usar id_card de table card para deckCard
        let insertDeckCard = 'INSERT INTO magydeck.deckCard (id_deck, id_card) VALUES (?, (SELECT id_card FROM magydeck.card WHERE id_card_api = ?))';
        console.log(insertDeckCard);
        let [insertDeckCardResult] = await pool.query(insertDeckCardResult, [id_deck, id_card_api]);
        console.log(insertDeckCardResult);
 
        res.status(200).send('Card added to deck successfully');

    } catch {
        console.log(err);
        res.status(500).send('Server error');
        next(err);
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