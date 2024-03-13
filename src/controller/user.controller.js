const { connection } =  require('../database');

const registerUser = async (req, res, next) => {
    const respuesta = {
        err: false,
        code: 200,
        message: "La operación se ha realizado con éxito",
        data: data
    };

    try {
        let sqlEmail = "SELECT emailUser from user WHERE email = '" + user.emailUser + "'";
        let [checkEmail] = await pool.query(sqlEmail);
        if(checkEmail.length){
            response.err = true;
            response.message = 'Ya existe un usuario con este email';
        } else {
            let sql = "INSERT INTO user (name, last_name, email, photo, password)" +
            "VALUES ('" + user.nameUser + "', '" +
            user.emailUser + "','" +
            user.passwordUser + "','" +
            user.description + "')" +
            user.avatar + "')" +
            user.icon + "')";
            await pool.query(sql);
            let sqlUser = "SELECT id_user FROM user WHERE emailUser = '" + user.emailUser + "'";
            let [userId] = await pool.query(sqlUser);
            user.id_user = userId[0].id_user;
            user.password = null;
            response.data = user;
        }
        res.send(response);
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
    getUser,
    editUser,
    logoutUser
};