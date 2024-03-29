const { log } = require('console');
const { pool } =  require('../database');

const registerUser = async (req, res, next) => {
    let respuesta = {
        error: false,
        codigo: 200,
        mensaje: "La operación se ha realizado con éxito"
    };

    let user = {
        nameUser: '',
        emailUser: '',
        passwordUser: '',
    }

    try {
        user = req.body; 

        let sqlEmail = "SELECT emailUser from magydeck.user WHERE emailUser = '" + user.emailUser + "'";
        let [checkEmail] = await pool.query(sqlEmail);
        if(checkEmail.length){
            res.status(400).json({error: true, codigo: 400, mensaje: 'Ya existe un usuario con este email'});
        } else {
            let sql = "INSERT INTO magydeck.user (nameUser, emailUser, passwordUser)" +
            "VALUES ('" + user.nameUser + "', '" +
            user.emailUser + "','" +
            user.passwordUser + "')";
            console.log(sql);
            await pool.query(sql);

            //obtener ultimo ID: id_user
            const [latestIdUserResult] = await pool.query("SELECT LAST_INSERT_ID() as id_user");
            const userIdParam = latestIdUserResult[0].id_user;
    
            // insertar deck
            let addDeck1 = "INSERT INTO magydeck.deck (id_user, indexDeck, nameDeck, id_photoDeck, share, sumScores, nScores) VALUES (?, 1, 'mazo1', 1, 0, 0, 0)";
            console.log(addDeck1);
            await pool.query(addDeck1, [userIdParam]);

            let addDeck2 = "INSERT INTO magydeck.deck (id_user, indexDeck, nameDeck, id_photoDeck, share, sumScores, nScores) VALUES (?, 2, 'mazo2', 2, 0, 0, 0)";
            console.log(addDeck2);
            await pool.query(addDeck2, [userIdParam]);

            let addDeck3 = "INSERT INTO magydeck.deck (id_user, indexDeck, nameDeck, id_photoDeck, share, sumScores, nScores) VALUES (?, 3, 'mazo3', 3, 0, 0, 0)";
            console.log(addDeck3);
            await pool.query(addDeck3, [userIdParam]);

            let addDeck4 = "INSERT INTO magydeck.deck (id_user, indexDeck, nameDeck, id_photoDeck, share, sumScores, nScores) VALUES (?, 4, 'mazo4', 4, 0, 0, 0)";
            console.log(addDeck4);
            await pool.query(addDeck4, [userIdParam]);

            let addDeck5 = "INSERT INTO magydeck.deck (id_user, indexDeck, nameDeck, id_photoDeck, share, sumScores, nScores) VALUES (?, 5, 'mazo5', 5, 0, 0, 0)";
            console.log(addDeck5);
            await pool.query(addDeck5, [userIdParam]);
    
            // insertar card
            const addIdApi = "INSERT INTO magydeck.card (id) VALUES ('55f46e4f-18d2-4ade-a5cb-ef26256b0f45')";
            await pool.query(addIdApi);
    
            // obtener id_card de la ultima card
            const [cardIdResult] = await pool.query("SELECT LAST_INSERT_ID() as id_card");
            const cardIdValue = cardIdResult[0].id_card;

            // obtener id_deck con id_user
            const [deckIdResult] = await pool.query("SELECT id_deck FROM magydeck.deck WHERE id_user = ?", [userIdParam]);
            const deckIdValue = deckIdResult[0].id_deck;
    
            // añadir datos en deckCard
            const addCardToDeck = "INSERT INTO magydeck.deckCard (id_deck, id_card, quantity) VALUES (?, ?, 1)";
            console.log(addCardToDeck);
            await pool.query(addCardToDeck, [deckIdValue, cardIdValue]);

            }
            res.status(200).send(respuesta);
            console.log('register try');    
        
        } catch(err) {
        console.error(err);
        respuesta.error = true;
        respuesta.codigo = 500;
        respuesta.mensaje = 'Ha ocurrido un error';
        res.status(200).send(respuesta);
        console.log('register catch');
    }
}


const loginUser = async (req, res, next) => {
    // const response = {
    //     err: false,
    //     code: 200,
    //     message: "La operación se ha realizado con éxito",
    //     data: null
    // };

    try {
        let sql = "SELECT * FROM magydeck.user WHERE user.emailUser = '" + req.body.emailUser + "' AND user.passwordUser = '" + req.body.passwordUser + "'";
        let [result] = await pool.query(sql);
        console.log(result);
        if(result.length){
            // response.data = result.length ? result[0] : null;

            const userData = result[0];
            // userData.id_user = userData.id_user;
            // response.data = userData;
            console.log('user data', userData);


            res.send(userData);
        } else {
            // response.err = true;
            // response.message = "Login incorrecto";
            // response.code = 400; 
            res.status(400).json({error: true, codigo: 400, mensaje: 'Login incorrecto'});

        }
        // res.status(200).send(response);
        // res.send(userData);

    } catch (error){
        // response.err = true; 
        // response.message = "Ocurrió un error";
        // response.code = 500;
        // res.status(200).send(response);
        // console.error('login catch', error);
        res.status(400).json({error: true, codigo: 400, mensaje: 'Login incorrecto'});

    } 
}

module.exports = {
    registerUser,
    loginUser
};