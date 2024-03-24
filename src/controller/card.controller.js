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
                  const addIdApi = "INSERT INTO magydeck.card (id) VALUES ('" + ids + "')";
                  await pool.query(addIdApi);
  
                  // obtener id_card de la ultima card
                  const [cardIdResult] = await pool.query("SELECT LAST_INSERT_ID() as id_card");
                  const cardIdValue = cardIdResult[0].id_card;
  
                  const addNewCardToDeckcardParams = [deckId, cardIdValue];
                  const addNewCardToDeckcardQuery = 'INSERT INTO magydeck.deckCard (id_deck, id_card, quantity) VALUES (?, ?, 1)';
                  const [addNewCardToDeckcardResult] = await pool.query(addNewCardToDeckcardQuery, addNewCardToDeckcardParams);
                  console.log('New card: ', cardIdValue, 'deck_id: ', deckId, addNewCardToDeckcardResult);

            }
            console.log('Cards added to deck');
            res.status(200).json({ error: false, code: 200, message: 'Cards added to deck' });
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