const { pool } =  require('../database');
const axios = require('axios');
const { format } = require('date-fns');

const getSharedDecks = async (req, res, next) => {
    let respuesta;
    try {
        let getShared = `SELECT user.nameUser, magydeck.deck.*,ROUND(COALESCE(sumScores/nScores, 0.0),1) AS mediaScore, 
        JSON_ARRAYAGG(JSON_OBJECT('userVotes', votos.id_user, 'date', votos.date, 'score', votos.score)) AS previousScore
         FROM magydeck.deck
                JOIN user ON (deck.id_user = user.id_user)
                LEFT JOIN votos ON (deck.id_deck = votos.id_deck)
                WHERE share = 1
                GROUP BY deck.id_deck`

        let [result] = await pool.query(getShared)

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Todavía no existen mazos compartidos, ¡animáte y comparte el tuyo!', data: result}
        } else {
            respuesta = {error: false, codigo: 200, mensaje: 'Mazos recuperados', data: result}
        }

        res.json(respuesta)

    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const getDeck = async (req, res, next) => {
    let respuesta;
    
    try {
        let params; 
        let deck;
        if (req.query.nameUser){
            params = '%' + req.query.nameUser + '%';
            
            deck = `SELECT user.nameUser, ROUND(COALESCE(sumScores/nScores, 0.0),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1 AND user.nameUser LIKE ?`

        } else if (req.query.nameDeck){
            params = '%' + req.query.nameDeck + '%';
            deck = `SELECT user.nameUser, ROUND(COALESCE(sumScores/nScores, 0.0),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1 AND deck.nameDeck LIKE ?`
        } else {
            params = null

            deck = `SELECT user.nameUser, ROUND(COALESCE(sumScores/nScores, 0.0),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1`
        }

        let [result] = await pool.query(deck, params)
        console.log(result);
        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se encontraron resultados', data:result}
        } else {
            respuesta = {error: false, codigo: 200, mensaje: 'Mazos recuperados', data: result}
        }

        res.json(respuesta)

    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const getVotedDecks = async (req, res, next) => {
    let respuesta;
    try {
        let getVoted = `SELECT user.nameUser, magydeck.deck.*, ROUND(COALESCE(sumScores/nScores, 0.0),1) AS mediaScore FROM magydeck.deck
        JOIN user ON (deck.id_user = user.id_user)
        WHERE share = 1
        ORDER BY mediaScore DESC LIMIT 3`

        let [result] = await pool.query(getVoted)

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Todavía no existen mazos votados, ¡animáte y vota!'}
        } else {
            respuesta = {error: false, codigo: 200, mensaje: 'Mazos votados recuperados', data: result}
        }

        res.json(respuesta)
    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const putMediaScore = async (req, res, next) => {
    try {
        let respuesta;
        let ownDeck = `SELECT * FROM deck WHERE id_user = ? AND id_deck = ?`

        let [mydeck] = await pool.query(ownDeck, [req.body.id_user, req.body.id_deck])
        if(mydeck.length > 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No puedes votar a tu propio mazo'};
        } else {
            let currentDay = format(new Date(), 'yyyy-MM-dd')
            let exist = `SELECT * FROM magydeck.votos
            WHERE votos.id_user = ? AND votos.id_deck = ? AND date = ?`
    
            let [existVoted] = await pool.query(exist, [req.body.id_user, req.body.id_deck, currentDay])
            
            existVoted.forEach(voto => {
                voto.date = format(new Date(voto.date), 'yyyy-MM-dd')
            })
    
            if(existVoted.length > 0){
                respuesta = {error:true, codigo: 200, mensaje: 'Ya has votado a este mazo hoy'};
            } else {
                let params = [req.body.score, req.body.id_deck]
                let putMediaScore = `UPDATE deck 
                SET sumScores = sumScores + ?,
                    nScores = nScores + 1
                    WHERE id_deck = ?`
        
                let [result] = await pool.query(putMediaScore, params)
                if(result.changedRows == 0){
                    respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios en la media'};
                } else {
                    let existVotePrevious = `SELECT * FROM magydeck.votos
                    WHERE votos.id_user = ? AND votos.id_deck = ?`
                    
                    let [previousVote] = await pool.query(existVotePrevious, [req.body.id_user, req.body.id_deck])
                    
                    if(previousVote.length > 0){
                        let updateVote = `UPDATE votos SET date = ?, score = ? WHERE id_user = ? AND id_deck = ?`
                        let [updateDate] = await pool.query(updateVote, [currentDay, req.body.score, req.body.id_user, req.body.id_deck])
                        
                     
                    } else {
                        let insertVote = `INSERT INTO votos (id_user, id_deck, date, score) VALUES (?, ?, ?, ?)`
                        let [insert] = await pool.query(insertVote, [req.body.id_user, req.body.id_deck, currentDay, req.body.score])
                    }
    
                    respuesta = {error:false, codigo: 200, mensaje: 'Media modificada correctamente', data: result};
                }
            }
        }

        res.json(respuesta)
    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const getScoreDeck = async (req,res, next) =>{
    try
    {
        let respuesta;
      
        let currentDay = format(new Date(), 'yyyy-MM-dd')
        let query = `SELECT date, id_user, score FROM magydeck.votos WHERE id_user = ? AND id_deck = ? AND date = ?`
        let [result] = await pool.query(query,[req.query.id_user, req.query.id_deck, currentDay])
        if (result.length === 0) {
            respuesta = { error: false, codigo: 200, mensaje: 'No se encontraron puntuaciones para este usuario y mazo.', data: [] };
        } else {
            result.forEach(voto => {
                voto.date = format(new Date(voto.date), 'yyyy-MM-dd')
            });
            respuesta = { error: false, codigo: 200, mensaje: 'Puntuaciones recuperadas', data: result };
        }
        res.json(respuesta);
    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const getDeckById = async (req, res, next) => {
    let respuesta;
    try {
        let id_deck = req.query.id_deck
        let type_line = req.query.type_line
        let deckById = `SELECT user.id_user, deck.id_deck, deck.namedeck, JSON_ARRAYAGG(JSON_OBJECT('id', card.id, 'quantity', deckCard.quantity)) AS cards
        FROM  magydeck.deckCard
            JOIN deck ON (deckCard.id_deck = deck.id_deck)
            JOIN user ON (deck.id_user = user.id_user)
            JOIN card ON (deckCard.id_card = card.id_card) 
        WHERE deck.share = 1 AND deck.id_deck = ?
        GROUP BY deck.id_deck;`

        let [result] = await pool.query(deckById, [id_deck])
            if(result.length == 0){
                respuesta = {error: true, codigo: 200, mensaje: 'Este mazo no contiene cartas'}
            } else {
                    // usar async dentro de callback para hacer que la función sea asíncrona 
                    let cardId = result[0].cards.map(async(card) =>{

                        // usar axios para traer los datos que quiero
                        const cards = await axios.get(`https://api.scryfall.com/cards/${card.id}`)

                        const dataCard = {
                            id: cards.data.id,
                            image_uris: cards.data.image_uris.normal, 
                            name: cards.data.name,
                            printed_name: cards.data.printed_name,
                            type_line: cards.data.type_line,
                            oracle_text: cards.data.oracle_text,
                            printed_text: cards.data.printed_text,
                            color_identity: cards.data.color_identity,
                            legalities: cards.data.legalities,
                            set_name: cards.data.set_name,
                            // contiene tipo para filtro
                            set_type: cards.data.set_type,
                            prices: cards.data.prices.eur,
                            quantity: card.quantity
                        }
                        return dataCard
                    })
                    // usar Promise.all. El método Promise.all(iterable) devuelve una promesa que termina correctamente cuando 
                    // todas las promesas en el argumento iterable han sido concluídas con éxito, o bien rechaza la petición
                    // con el motivo pasado por la primera promesa que es rechazada.
                    const cartas = await Promise.all(cardId)
                 
                    if (type_line == 'creature'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('creature')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Criaturas recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                   
                    } else if (type_line == 'artifact'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('artifact')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Artefactos recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else if (type_line == 'enchantment'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('enchantment')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Encantamientos recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else if (type_line == 'sorcery'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('sorcery')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Conjuros recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else if (type_line == 'instant'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('instant')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Instantáneas recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else if (type_line == 'planeswalker'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('planeswalker')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'PlanesWalkers recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else if (type_line == 'land'){
                        console.log(type_line);
                        let cardfilter = cartas.filter((carta) =>{ 
                        let type= carta.type_line.toLowerCase().includes('land')
                        return type
                        })
                        respuesta = {error: false, codigo: 200, mensaje: 'Tierras recuperadas', data: {nameDeck: result[0].namedeck,cards: cardfilter}}
                    
                    } else {
                        respuesta = {error: false, codigo: 200, mensaje: 'Mazo recuperado', data: {nameDeck: result[0].namedeck,cards: cartas}}
                    }
                
        }
        res.json(respuesta)

    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

module.exports = {
    getSharedDecks,
    getVotedDecks,
    getDeck,
    putMediaScore,
    getScoreDeck,
    getDeckById
};



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA