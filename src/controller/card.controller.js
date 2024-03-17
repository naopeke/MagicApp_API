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
            res.status(500).json({error: true, codigo: 500, mensaje: 'Error fetching card data'});
        }
        } else {
        res.status(404).json({error: true, codigo: 404, mensaje: 'Card not found'});
    }
};

//https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
//500 Internal Server Error
//400 Bad Request
//404 Not Found


// POST /api/mis-mazos/{deckId}/cards

//
const addCard = async (req, res, next) => {

    // const { id_user, id_deck, id_card_api } = req.body;

    let params = [req.body.id_user, req.body.id_deck];
    let params2 = [req.body.id];
    let params3 = [req.body.id_deck, req.body.id];

    try {

        // detectar el dueño de deck
        let deckOwner = 'SELECT id_deck FROM magydeck.deck WHERE id_deck = ? AND id_user = ?';
        console.log(deckOwner);
        const [deckOwnerResult] = await pool.query(deckOwner, params);
        if (deckOwnerResult.length === 0) {
            res.status(404).json({error: true, codigo: 404, mensaje: 'not a deck owner'});
        }else{
            res.json({error: false, codigo: 200, mensaje: 'ok', data: deckOwnerResult});
        }
        //403 Forbidden



        // buscar si existe la misma carta
        let cardExists = 'SELECT id_card FROM magydeck.card WHERE id = ?';
        console.log(cardExists);
        const [cardExistsResult] = await pool.query(cardExists, params2);
        console.log(cardExistsResult);

        
        // si no existe, añadir como la nueva carta
        if (cardExists.length === 0){
            let insertCard = 'INSERT INTO magydeck.card (id, quantity) VALUES(?, 1)';
            console.log(insertCard);
            const [insertCardResult] = await pool.query(insertCard, params2);
            console.log(insertCardResult);
        } else {
            //si existe, +1 cantidad
            let addQuantity = 'UPDATE magydeck.card SET quantity = quantity + 1 WHERE id = ?';
            console.log(addQuantity);
            const [addQuantityResult] = await pool.query(addQuantity, params2);
            console.log(addQuantityResult);
        }


        // usar id_card de table card para deckCard
        let insertDeckCard = 'INSERT INTO magydeck.deckCard (id_deck, id_card) VALUES (?, (SELECT id_card FROM magydeck.card WHERE id = ?))';
        console.log(insertDeckCard);
        let [insertDeckCardResult] = await pool.query(insertDeckCard, params3);
        console.log(insertDeckCardResult);
 
        res.json({error: false, codigo: 200, mensaje: 'Card added to deck'});

    } catch {
        console.log(err);
        res.status(500).json({error: true, codigo: 500, mensaje: 'Server error'});
        next(err);
    }
}


const addCards = async (req, res, next) => {

    let { id_user, id_deck, cardIds } = req.body; //cardIds es array de cardIds

    let params = [req.body.id_deck, req.body.id_user,];  

    try {
      const deckOwner = 'SELECT id_deck FROM magydeck.deck WHERE id_deck = ? AND id_user = ?';
        console.log(deckOwner);
      const [deckOwnerResult] = await pool.query(deckOwner, params);
        console.log(deckOwnerResult);
  
      if (deckOwnerResult.length === 0) {
        res.status(404).json({error: true, codigo: 404, mensaje: 'not a deck owner'});
      }
  
      for (const cardId of cardIds) {
        // bucle para array de cardIds
        const params2 = [cardId]; 
        const params3 = [id_deck, cardId]; 

        const cardsExist = 'SELECT id_card FROM magydeck.card WHERE id = ?';
        console.log(cardsExist);
        const [cardsExistResult] = await pool.query(cardsExist, params2);
        console.log(cardsExistResult);
  
        if (cardsExistResult.length === 0) {
        // si no existe, insertar cantidad 1
          await pool.query('INSERT INTO magydeck.card (id, quantity) VALUES(?, 1)', params2);
        } else {
        // si existe, update cantidad +1
          await pool.query('UPDATE magydeck.card SET quantity = quantity + 1 WHERE id = ?', params2);
        }
  
        // agregar id_card a id_deck
        await pool.query('INSERT INTO magydeck.deckCard (id_deck, id_card) VALUES (?, ?)', params3);
      }
  
      res.json({error: false, codigo: 200, mensaje: 'Cards added to deck'});
      
    } catch (err) {
      console.log(err);
      res.status(500).json({error: true, codigo: 500, mensaje: 'Server error'});
    }
  };

  

module.exports = {
    fetchCardData,
    addCard,
    addCards
};