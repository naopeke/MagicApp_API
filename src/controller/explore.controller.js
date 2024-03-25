const { pool } =  require('../database');
const axios = require('axios');

const getSharedDecks = async (req, res, next) => {
    let respuesta;
    try {
        let getShared = `SELECT user.nameUser, magydeck.deck.*, ROUND((sumScores/nScores),1) AS mediaScore FROM magydeck.deck
        JOIN user ON (deck.id_user = user.id_user)
        WHERE share = 1`

        let [result] = await pool.query(getShared)

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Todavía no existen mazos compartidos, ¡animáte y comparte el tuyo!'}
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
            
            deck = `SELECT user.nameUser, ROUND((sumScores/nScores),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1 AND user.nameUser LIKE ?`

        } else if (req.query.nameDeck){
            params = '%' + req.query.nameDeck + '%';
            deck = `SELECT user.nameUser, ROUND((sumScores/nScores),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1 AND deck.nameDeck LIKE ?`
        } else {
            params = null

            deck = `SELECT user.nameUser, ROUND((sumScores/nScores),1) AS mediaScore, magydeck.deck.* FROM magydeck.deck
            JOIN user ON (deck.id_user = user.id_user)
            WHERE share = 1`
        }

        let [result] = await pool.query(deck, params)
        console.log(result);
        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se encontraron resultados'}
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
        let getVoted = `SELECT user.nameUser, magydeck.deck.*, ROUND((sumScores/nScores),1) AS mediaScore FROM magydeck.deck
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
        let params = [req.body.score, req.body.id_deck]
        let putMediaScore = `UPDATE deck 
        SET sumScores = sumScores + ?,
            nScores = nScores + 1
            WHERE id_deck = ?`

        let [result] = await pool.query(putMediaScore, params)
        if(result.changedRows == 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios en la media'};
        } else {
            respuesta = {error:false, codigo: 200, mensaje: 'Media modificada correctamente', data: result};
        }
        res.json(respuesta)
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
    getDeckById
};



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA