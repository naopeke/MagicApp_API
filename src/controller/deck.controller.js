const { pool } =  require('../database');
const axios = require('axios');

//* get id_deck, indexDeck, nameDeck, id_card, id, share, quantity
// SELECT deck.id_deck, deck.indexDeck, deck.nameDeck, card.id_card, card.id, deck.share, deckCard.quantity 
// FROM magydeck.deck 
// JOIN magydeck.deckCard ON deck.id_deck = deckCard.id_deck 
// JOIN magydeck.card ON deckCard.id_card = card.id_card 
// WHERE id_user = 13 
// ORDER BY deck.id_deck ASC, deck.indexDeck ASC;




const getMyDecksWithData = async (req, res, next) => {
    try {
        const userId = [req.params.id_user];
        const getMyDecksWithData = `
            SELECT deck.id_deck, deck.indexDeck, deck.nameDeck, deck.share, deckCard.id_card, card.id, deckCard.quantity 
            FROM magydeck.deck 
            LEFT JOIN magydeck.deckCard ON deck.id_deck = deckCard.id_deck
            LEFT JOIN magydeck.card ON deckCard.id_card = card.id_card 
            WHERE id_user = ? 
            ORDER BY deck.id_deck ASC, deck.indexDeck ASC;
        `;
        //LEFT JOIN para que salga datos sin cartas

        const [getMyDecksWithDataResult] = await pool.query(getMyDecksWithData, userId);

        const decksMap = new Map(); // Usar Map con key: id_deck

        for (const deck of getMyDecksWithDataResult) {
            try {
                const response = await axios.get(`https://api.scryfall.com/cards/${deck.id}`);
                const cardData = {
                    id_card: deck.id_card,
                    id: deck.id,
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
                    quantity: deck.quantity
                };

                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
                //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get

                // si existe element con key:id_deck, devuelve boolean
                if (decksMap.has(deck.id_deck)) 
                {

                    // obtener el valor
                    decksMap.get(deck.id_deck).cards.push(cardData);
                } else {

                    // si boolean es false, añadir key y object al Map
                    decksMap.set(deck.id_deck, {
                        id_deck: deck.id_deck,
                        indexDeck: deck.indexDeck,
                        nameDeck: deck.nameDeck,
                        share: deck.share,
                        cards: [cardData]
                    });
                }
                
            } catch (err) {
                console.log('Error fetching card data:', deck.id_card, deck.id, err);
                // cuando no hay datos de id_card, id en deck table, o id no es correcto, sale error desde axios
            }
        }

        //decksMap.values(): devolver todos los valores como nuevo map iterator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
        //Array.from(): cambiar a un Array https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
        const decks = Array.from(decksMap.values());
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
        res.status(500).json({ error: true, message: 'Failed to update deck name' });
    }
}

const updateCardQuantity = async (req, res, next) => {
    try {
          const updateCardQuantityParams = [req.body.id_deck, req.body.action];

          if (action === 'increase') {
              const increaseQuantity = `
              UPDATE magydeck.deckCard
              SET quantity = quantity + 1
              WHERE id_deck = ?
              `;
              await pool.query(increaseQuantity, updateCardQuantityParams);
              
          } else if (action === 'decrease') {
            const decreaseQuantity = `
              UPDATE magydeck.deckCard
              SET quantity = quantity - 1
              WHERE id_deck = ?
              `;
              await pool.query(decreaseQuantity, updateCardQuantityParams);

          } else if (action === 'delete') {
            const deleteDeckCard = `
              DELETE FROM magydeck.deckCard
              JOIN card ON deckCard.id_card = card.id_card 
              WHERE id_deck = ? id_card = ?
              `;
              await pool.query(deleteDeckCard, updateCardQuantityParams);
          }
  
    } catch {
        console.log('edit deck catch');
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

            const message = newShareStatus === 1 ? 'Ahora está compartido' : 'Ahora está privado';
        
            res.json({ error: false, code:200, message: message, shareStatus: newShareStatus });
        } else {
            res.status(404).json({ error: true, code:404, message: "Deck not found" });
        }

    } catch (error) {
        res.status(500).json({ error: true, code:500, message: "Server error", error: error.message });
    }
}

// const mySharedDeck = async (req, res, next) => {
//     try {
//         const shareDeckParams = req.params.id_deck;
        
//         const getCurrentShareStatus = `SELECT share FROM magydeck.deck WHERE id_deck = ?`;
//         const shareStatusResult = await pool.query(getCurrentShareStatus, [shareDeckParams]);

//         if(shareStatusResult.length > 0){
//             const newShareStatus = shareStatusResult[0].share === 1 ? 0 : 1;
//             const updatedShareStatus = `
//             UPDATE magydeck.deck
//             SET share = ?
//             WHERE id_deck = ?
//         `;
//         await pool.query(updatedShareStatus, [newShareStatus, shareDeckParams]);

//         const message = newShareStatus === 1 ? 'Ahora está compartido' : 'Ahora está privado';
        
//             res.json({ error: false, code:200, message: message, shareStatus: newShareStatus });

//         }


//     } catch (error) {
//         res.status(500).json({ error: true, code:500, message: "Server error", error: error.message });

//     }
// }


module.exports = {
    // getMyDeckById,
    getMyDecksWithData,
    editMyDeckName,
    updateCardQuantity,
    mySharedDeck
};