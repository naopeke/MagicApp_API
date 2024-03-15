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
        passwordUser: 'contraseña',
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
        }
        res.send(respuesta);
        console.log('register try');
    }catch(err){
        console.error(err);
        console.log('register catch');
    }
}




const loginUser = async (req, res, next) => {
    const response = {
        err: false,
        code: 200,
        message: "La operación se ha realizado con éxito",
        data: null
    };

    try {
        let sql = "SELECT * FROM magydeck.user WHERE user.emailUser = '" + req.body.emailUser + "' AND user.passwordUser = '" + req.body.passwordUser + "'";
        let [result] = await pool.query(sql);
        if(result.length){
            response.data = result.length ? result[0] : null;
        } else {
            response.err = true;
            response.message = "Login incorrecto";
            response.code = 400; 
        }
        console.log('login try');
    } catch (error){
        response.err = true; 
        response.message = "Ocurrió un error";
        response.code = 500; 
        console.error('login catch', error);
    }
    res.send(response); 
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