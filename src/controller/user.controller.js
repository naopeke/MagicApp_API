const { connection } =  require('../database');


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

        let sqlEmail = "SELECT emailUser from user WHERE emailUser = '" + user.emailUser + "'";
        let [checkEmail] = await pool.query(sqlEmail);
        if(checkEmail.length){
            respuesta.error = true;
            respuesta.codigo = 400; 
            respuesta.mensaje = 'Ya existe un usuario con este email';
        } else {
            let sql = "INSERT INTO user (nameUser, emailUser, passwordUser)" +
            "VALUES ('" + user.nameUser + "', '" +
            user.emailUser + "','" +
            user.passwordUser + "')";
            console.log(sql);
            await pool.query(sql);
            let sqlUser = "SELECT id_user FROM user WHERE emailUser = '" + user.emailUser + "'";
            let [userId] = await pool.query(sqlUser);
            user.id_user = userId[0].id_user;
            user.passwordUser = null;
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