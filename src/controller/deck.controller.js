const { pool } =  require('../database');
const axios = require('axios');

const getMyDecksWithData = async (req, res, next) => {
    try {
        const userId = [req.params.id_user];
        const getDecks = `
            SELECT id_deck, indexDeck, nameDeck, share
            FROM magydeck.deck
            WHERE id_user = ?
            ORDER BY id_deck ASC, indexDeck ASC;
        `;
        const [decksResult] = await pool.query(getDecks, userId);

        // crear Map object para key (guardar deck info y lista de cards)
        const decksMap = new Map();

        for (const deck of decksResult) {
            const getCards = `
                SELECT deckCard.id_card, card.id, deckCard.id_deckCard, deckCard.quantity
                FROM magydeck.deckCard
                LEFT JOIN magydeck.card ON deckCard.id_card = card.id_card
                WHERE deckCard.id_deck = ?
            `;
            //LEFT JOIN para que salga datos sin cartas
            
            const [cardsResult] = await pool.query(getCards, [deck.id_deck]);

            // axios.get es asynchronous request asi que entero es async
            // Promise.all() https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
                //cuando termina todas las promesas, devuelve una promesa
                // asyncronous a cardsResult todos, y resultado es cardsData
            const cardsData = await Promise.all(cardsResult.map(async (card) => {
                if (card.id) {
                    try {
                        const response = await axios.get(`https://api.scryfall.com/cards/${card.id}`);
                        return {
                            // copiar los siguientes datos para crear nuevo object
                            ...card,
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
                            prices: response.data.prices ? response.data.prices.eur : null,
                        };
                    } catch (error) {
                        console.log('Error fetching card data for ID:', card.id, error);
                    }
                } else {
                    // cuando dato es null, devuelve también y hacer nuevo object
                    return { ...card, id_card: null, id: null };
                }
            }));

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
            //añadir key y object al Map : Deck info y lista de cards
            decksMap.set(deck.id_deck, {
                id_deck: deck.id_deck,
                indexDeck: deck.indexDeck,
                nameDeck: deck.nameDeck,
                share: deck.share,
                cards: cardsData
            });
        }

        //decksMap.values(): devolver todos los valores como nuevo map iterator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
        //Array.from(): cambiar a un Array https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        const decks = Array.from(decksMap.values());
        // mandar como json
        res.json(decks);

    } catch (error) {
        console.log('Error getting decks data:', error);
        res.status(500).json({ error: true, code: 500, message: 'Server error' });
    }
};



const editMyDeckName = async (req, res, next) => {
    try {

        const editDeckNameParams = [req.body.nameDeck, req.params.id_deck]
        const editDeckName = `
                            UPDATE magydeck.deck
                            SET nameDeck = COALESCE(?, nameDeck)
                            WHERE id_deck = ?;
                            `;
        await pool.query(editDeckName, editDeckNameParams);
        console.log('edit deck name try');
        res.status(200).json({ error: false, code:200, message: 'Deck name updated' });

    } catch {
        res.status(500).json({ error: true, code:500, message: 'Failed to update deck name' });
    }
}



const updateCardQuantity = async (req, res, next) => {
    try {
          const id_deckCard = [req.params.id_deckCard];
          const action = req.body.action;
          
          if (action === 'increase') {
              const increaseQuantity = `
              UPDATE magydeck.deckCard
              SET quantity = quantity + 1
              WHERE id_deckCard = ?
              `;
              await pool.query(increaseQuantity, id_deckCard);
              
          } else if (action === 'decrease') {
            const decreaseQuantity = `
              UPDATE magydeck.deckCard
              SET quantity = quantity - 1
              WHERE id_deckCard = ?
              `;
              await pool.query(decreaseQuantity, id_deckCard);
          }
          res.json({ error: false, code: 200, message: 'Quantity updated' });
  
    } catch (err) {
        console.log('Error :', err);
        res.status(500).json({error: true, code: 500, message: 'Server error'});
    }
}



const deleteCardsQuantity = async (req, res, next) => {
    try {
        const id_deckCard = [req.params.id_deckCard];
        const deleteDeckCard = `
        DELETE deckCard FROM magydeck.deckCard
        JOIN magydeck.card ON deckCard.id_card = card.id_card 
        WHERE deckCard.id_deckCard = ?
        `;
        await pool.query(deleteDeckCard, id_deckCard);

        res.json({ error: false, code: 200, message: 'Card deleted' });
    } catch (err) {
        console.log('Error :', err);
        res.status(500).json({ error: true, code: 500, message: 'Server error' });
    }
}



const mySharedDeck = async (req, res, next) => {
    try {
        const id_deck = req.params.id_deck;
        
        const getCurrentShareStatus = `SELECT share FROM magydeck.deck WHERE id_deck = ?`;
        const [shareStatusResult] = await pool.query(getCurrentShareStatus, [id_deck]);

        if(shareStatusResult.length > 0){
            const newShareStatus = shareStatusResult[0].share === 1 ? 0 : 1; // cuando share es 1, cambia a 0, cuando es 0, cambia a 1
            const updatedShareStatus = `
            UPDATE magydeck.deck
            SET share = ?
            WHERE id_deck = ?;
            `;
            await pool.query(updatedShareStatus, [newShareStatus, id_deck]);

            const [updatedShareStatusResult] = await pool.query(getCurrentShareStatus, [id_deck]);
            console.log('updated status: ', updatedShareStatusResult[0].share); // updated status

            const message = newShareStatus === 1 ? 'Ahora este mazo está compartido' : 'Ahora este mazo está privado';
        
            res.json({ error: false, code:200, message: message, shareStatus: newShareStatus });
        } else {
            res.status(404).json({ error: true, code:404, message: "Deck not found" });
        }

    } catch (error) {
        res.status(500).json({ error: true, code:500, message: "Server error", error: error.message });
    }
}



module.exports = {
    getMyDecksWithData,
    editMyDeckName,
    updateCardQuantity,
    deleteCardsQuantity,
    mySharedDeck
};