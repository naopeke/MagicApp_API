const { pool } =  require('../database');

const getSharedDecks = async (req, res, next) => {
    let respuesta;
    try {
        let getShared = `SELECT user.nameUser, magydeck.deck.* FROM magydeck.deck
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

const getDeckbyUser = async (req, res, next) => {
    let respuesta;
    try {
        let params = req.params.nameUser
        let deck = `SELECT user.nameUser, magydeck.deck.* FROM magydeck.deck
        JOIN user ON (deck.id_user = user.id_user)
        WHERE share = 1 AND user.nameUser = ?`
        
        let [result] = await pool.query(deck, params)
        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Usuario no encontrado'}
        } else {
            respuesta = {error: false, codigo: 200, mensaje: 'Mazos recuperados', data: result}
        }

        res.json(respuesta)

    } catch(error) {
        console.error(`Error: ${error}`);
    }
}

const getDeckbyDeck = async (req, res, next) => {
    let respuesta;
    try {
        let params = req.params.nameDeck
        let deck = `SELECT user.nameUser, magydeck.deck.* FROM magydeck.deck
        JOIN user ON (deck.id_user = user.id_user)
        WHERE share = 1 AND deck.nameDeck = ?`
        
        let [result] = await pool.query(deck, params)
        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'Usuario no encontrado'}
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
        let getVoted = `SELECT user.nameUser, magydeck.deck.* FROM magydeck.deck
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
    } catch {
        console.log('add cards catch');
    }
}


const putMediaScore = async (req, res, next) => {
    try {
        let params = [req.body.mediaScore, req.body.id_deck]
        let putMediaScore = `UPDATE deck 
        SET mediaScore = COALESCE(?, mediaScore)
        WHERE id_deck = ?`

        let [result] = await pool.query(putMediaScore, params)
        if(result.changedRows == 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios en la media'};
        } else {
            respuesta = {error:false, codigo: 200, mensaje: 'Media modificada correctamente', data: result};
        }
        res.json(respuesta)
    } catch {
        console.log('add cards catch');
    }
}

const getDeckById = async (req, res, next) => {
    try {
        console.log('add cards try');
    } catch {
        console.log('add cards catch');
    }
}

module.exports = {
    getSharedDecks,
    getVotedDecks,
    getDeckbyUser,
    getDeckbyDeck,
    putMediaScore,
    getDeckById
};



// *NOTE -  Explora

// router.get('/explora/ ) mazos que tienen compartir en true
// router.get('/explora/votados, ) mazos que tienen compartir true y limit a los cinco con mediascore más alta
// router.get('/explora/:id_deck ) que saque el mazo concreto en funcion del usuario DARLE UNA VUELTA