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
        }
        res.status(200).send(respuesta);
        console.log('register try');

    }catch(err){
        console.error(err);
        respuesta.error = true;
        respuesta.codigo = 500;
        respuesta.mensaje = 'Ha ocurrido un error';
        res.status(200).send(respuesta);
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
        res.status(200).send(response);
        console.log('login try');
    } catch (error){
        response.err = true; 
        response.message = "Ocurrió un error";
        response.code = 500;
        res.status(200).send(response);
        console.error('login catch', error);
    } 
}
}

module.exports = {
    registerUser,
    loginUser
};