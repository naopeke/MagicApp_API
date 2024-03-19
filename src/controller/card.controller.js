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
            res.status(500).json({error: true, code: 500, message: 'Error fetching card data'});
        }
        } else {
        res.status(404).json({error: true, code: 404, message: 'Card not found'});
    }
};

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//500 Internal Server Error
//400 Bad Request
//404 Not Found


//* Obtener id_deck desde id_user y indexDeck
// SELECT id_deck 
// FROM magydeck.deck 
// WHERE id_user = 13 AND indexDeck = 3

//* Contar si hay misma card.id dento de deckCard.id_deck
// SELECT COUNT(*) AS cardCount 
// FROM magydeck.deckCard 
// JOIN magydeck.card ON magydeck.deckCard.id_card = magydeck.card.id_card
// JOIN magydeck.deck ON magydeck.deckCard.id_deck = magydeck.deck.id_deck
// WHERE deckCard.id_deck = 13 AND card.id = 'cc0b6054-7d3a-4b6f-bc40-5c9e88cf4b6e'

//* Si hay, obtener id_card con id
// SELECT magydeck.card.id_card
// FROM magydeck.card
// JOIN magydeck.deckCard ON magydeck.card.id_card = magydeck.deckCard.id_card
// JOIN magydeck.deck ON magydeck.deckCard.id_deck = magydeck.deck.id_deck
// WHERE magydeck.deckCard.id_deck = 13 AND magydeck.card.id = 'cc0b6054-7d3a-4b6f-bc40-5c9e88cf4b6e';

//* Y update quantity +1
// UPDATE magydeck.deckCard 
// SET quantity = quantity + 1 
// WHERE id_deck = 13 AND id_card = 3

//* si no existe
//*1. insertar id(api) en card
// INSERT INTO magydeck.card (id)
// VALUES ('f935e21d-f20c-4f73-92b6-e2e2ea8841af');

// INSERT INTO magydeck.card (id) 
// VALUES ();

//*2. obtener el ultimo id
// SELECT LAST_INSERT_ID() AS new_id_card;

//*3. insertar id_card y quantity
// INSERT INTO magydeck.deckCard (id_deck, id_card, quantity) 
// VALUES (13, 57, 1);

// INSERT INTO magydeck.deckCard (id_deck, id_card, quantity) 
// VALUES (?, ?, 1);



const addCardsToDeck = async (req, res, next) => {
    try {
        // obtener deck_id con user_id e indexDeck
        console.log(req.body.id_user, req.body.indexDeck);
        const deckIdParams = [req.body.id_user, req.body.indexDeck];
        const getDeckIdByUserAndIndex = 'SELECT id_deck FROM magydeck.deck WHERE id_user = ? AND indexDeck = ?';
        const [getDeckIdResult] = await pool.query(getDeckIdByUserAndIndex, deckIdParams);
        const deckId = getDeckIdResult[0].id_deck;
        console.log('deckId by user and index: ', deckId);

        // comprobar si existe esa carta en deck o no
        for (const ids of req.body.ids) {
            console.log('Card Api Ids:', req.body.ids);
            const cardCountParams = [deckId, ids];
            const checkCardCount = 'SELECT COUNT(*) AS cardCount FROM magydeck.deckCard JOIN magydeck.card ON deckCard.id_card = card.id_card WHERE deckCard.id_deck = ? AND card.id = ?';
            const [cardCountResult] = await pool.query(checkCardCount, cardCountParams);
            const cardCount = cardCountResult[0].cardCount;
            console.log('cardCount: ', cardCount);

            if (cardCount > 0) {
                // si existe esa carta en deck, verificar id_card
                const getCardIdParams = [ids];
                const getCardIdQuery = 'SELECT id_card FROM magydeck.card WHERE id = ?';
                const [getCardIdResult] = await pool.query(getCardIdQuery, getCardIdParams);
                const cardId = getCardIdResult[0].id_card;
                console.log('Card ID: ', cardId);

                //quantity + 1
                const updateCardCountParams = [deckId, cardId];
                const updateCardCount = 'UPDATE magydeck.deckCard SET quantity = quantity + 1 WHERE id_deck = ? AND id_card = ?';
                const [updateCardCountResult] = await pool.query(updateCardCount, updateCardCountParams);
                console.log('id_card: ', cardId, 'id_deck: ', deckId, 'result: ', updateCardCountResult); 
            } else {
                // si no existe, añadir id(api) y conectar con id_deck
                const getCardIdParams = [ids];
                const getCardIdQuery = 'SELECT id_card FROM magydeck.card WHERE id = ?';
                const [getCardIdResult] = await pool.query(getCardIdQuery, getCardIdParams);
                const cardId = getCardIdResult[0].id_card;
                console.log('Card ID: ', cardId);

                const addNewCardToDeckcardParams = [deckId, cardId];
                const addNewCardToDeckcardQuery = 'INSERT INTO magydeck.deckCard (id_deck, id_card, quantity) VALUES (?, ?, 1)';
                const [addNewCardToDeckcardResult] = await pool.query(addNewCardToDeckcardQuery, addNewCardToDeckcardParams);           
                console.log('New card: ', cardId, 'deck_id: ', deckId, addNewCardToDeckcardResult);   
            }
            console.log('Cards added to deck');
            res.status(200).json({ success: true, code: 200, message: 'Cards added to deck' });
            }
        
        } catch (error) {
        console.log('Error in adding cards to deck:', error);
        res.status(500).json({ error: true, code: 500, message: 'Server error' });
    }
};


module.exports = {
    fetchCardData,
    addCardsToDeck
};