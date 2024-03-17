const { pool } =  require('../database');


const registerUser = async (req, res, next) => {
    let respuesta = {
        error: false,
        codigo: 200,
        mensaje: "La operación se ha realizado con éxito"
    };

    let user = {
        nameUser: 'Nombre',
        emailUser: 'email',
        passwordUser: 'contraseña'
    }

    try {
        user = req.body; 

        let sqlEmail = "SELECT emailUser from magydeck.user WHERE emailUser = '" + user.emailUser + "'";
        let [checkEmail] = await pool.query(sqlEmail);
        if(checkEmail.length){
            respuesta.error = true;
            respuesta.codigo = 400; 
            respuesta.mensaje = 'Ya existe un usuario con este email';
        } else {
            let sql = "INSERT INTO magydeck.user (nameUser, emailUser, passwordUser)" +
            "VALUES ('" + user.nameUser + "', '" +
            user.emailUser + "','" +
            user.passwordUser + "')";
            console.log(sql);
            await pool.query(sql);
            // let sqlUser = "SELECT id_user FROM user WHERE emailUser = '" + user.emailUser + "'";
            // let [userId] = await pool.query(sqlUser);
            // user.id_user = userId[0].id_user;
            // user.passwordUser = null;

            //https://www.w3schools.com/sql/func_mysql_last_insert_id.asp
            // obtener el ultimo id_user, y crear 5 mazos con el ultimo id_user
            let latestIdUser = "SELECT LAST_INSERT_ID() as id_user;"
            console.log(latestIdUser);
            let [latestIdUserResult] = await pool.query(latestIdUser);
            console.log(latestIdUserResult);
            const userIdParam = [latestIdUserResult[0].id_user];

            let addDeck1 = "INSERT INTO magydeck.deck (id_user, nameDeck, id_photoDeck, share, mediaScore) VALUES (?, 'mimazo1', 1, 0, 0)";
            console.log(addDeck1);
            await pool.query(addDeck1, userIdParam);
            
            let addDeck2 = "INSERT INTO magydeck.deck (id_user, nameDeck, id_photoDeck, share, mediaScore) VALUES (?, 'mimazo2', 2, 0, 0)";
            console.log(addDeck2);
            await pool.query(addDeck2, userIdParam);
            
            let addDeck3 = "INSERT INTO magydeck.deck (id_user, nameDeck, id_photoDeck, share, mediaScore) VALUES (?, 'mimazo3', 3, 0, 0)";
            console.log(addDeck3);
            await pool.query(addDeck3, userIdParam);
            
            let addDeck4 = "INSERT INTO magydeck.deck (id_user, nameDeck, id_photoDeck, share, mediaScore) VALUES (?, 'mimazo4', 4, 0, 0)";
            console.log(addDeck4);
            await pool.query(addDeck4, userIdParam);
            
            let addDeck5 = "INSERT INTO magydeck.deck (id_user, nameDeck, id_photoDeck, share, mediaScore) VALUES (?, 'mimazo5', 5, 0, 0)";
            console.log(addDeck5);
            await pool.query(addDeck5, userIdParam);

        }
        res.send(respuesta);
        console.log('register try');

    }catch(err){
        console.error(err);
        console.log('register catch');
    }
}

const loginUser = async (req, res, next) => {
    const respuesta = {
        error: false,
        codigo: 200,
        mensaje: "La operación se ha realizado con éxito",
        data: null
    };

    try {
        let sql = "SELECT * FROM user WHERE user.emailUser = '" + req.body.emailUser + "' AND user.passwordUser = '" + req.body.passwordUser + "'";
        let [result] = await pool.query(sql);
        if(result.length){
            respuesta.data = result.length ? result[0] : null;
        } else {
            respuesta.error = true;
            respuesta.mensaje = "Login incorrecto";
            respuesta.codigo = 400; 
        }
        res.send(respuesta);
        console.log('login try');
    } catch {

        console.log('login catch');
    }
}



const logoutUser = (req, res, next) => {
    res.json({ success: true });
}


module.exports = {
    registerUser,
    loginUser,
    // getUser,
    // editUser,
    logoutUser
};