const { connection } =  require('../database');

const registerUser = async (req, res, next) => {
    const respuesta = {
        error: false,
        codigo: 200,
        mensaje: "La operación se ha realizado con éxito"
    };

    const user = {
        nameUser: 'Nombre',
        emailUser: 'email',
        passwordUser: 'contraseña'
    }

    try {
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
    try {
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