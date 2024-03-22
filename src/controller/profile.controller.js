
const { pool } =  require('../database');

const getProfile = async(req, res, next) => {
    try{
        let respuesta; 
        let params = req.params.id_user

        let getProfle = `SELECT  magydeck.user.* FROM magydeck.user
        WHERE id_user = ?`

        let [result] = await pool.query(getProfle, params)
        if(result.length == 1){
            respuesta = {error:false, codigo: 200, mensaje: 'Datos recuperados correctamente', data: result};
        } else {
            respuesta = {error:true, codigo: 200, mensaje: 'No existe el usuario', data: result};
        }
       
        console.log(result);
        res.json(respuesta);
    }

    catch{

    }
}

const putProfile = async (req, res, next) => {
    try {
        let respuesta;

        let params = [req.body.nameUser, req.body.emailUser, req.body.description, req.body.id_user]
        let putProfile =`UPDATE user 
                SET nameUser = COALESCE(?, nameUser), 
                    emailUser = COALESCE(?, emailUser),
                    description = COALESCE(?, description)
                WHERE id_user = ?`
        let [result] = await pool.query(putProfile, params)
        
        if(result.changedRows == 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios'};
        } else {
            respuesta = {error:false, codigo: 200, mensaje: 'Datos modificados correctamente', data: result};
        }
        res.json(respuesta)
    } catch(error){
        console.error(`Error: ${error}`);
    }
}

const putPassword = async (req, res, next) => {
    try {
        let respuesta;
        let params = [req.body.passwordUser, req.body.id_user]
       
        let newPassword = `UPDATE user 
                            SET passwordUser = COALESCE(?, passwordUser)
                            WHERE id_user = ?`

        let [result] = await pool.query(newPassword, params)
        if(result.changedRows == 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios en la contraseña'};
        } else {
            respuesta = {error:false, codigo: 200, mensaje: 'Datos modificados correctamente', data: result};
        }

        res.json(respuesta)
    } catch(error){
        console.error(`Error: ${error}`);
    }
}

const putAvatar = async (req, res, next) => {
    try {
        let respuesta;

        let params = [req.body.avatar, req.body.icon, req.body.id_user]
        let putProfile =`UPDATE user 
                SET avatar = COALESCE(?, avatar), 
                    icon = COALESCE(?, icon)
                WHERE id_user = ?`
        let [result] = await pool.query(putProfile, params)
        
        if(result.changedRows == 0){
            respuesta = {error:true, codigo: 200, mensaje: 'No se han detectado cambios'};
        } else {
            respuesta = {error:false, codigo: 200, mensaje: 'Datos modificados correctamente', data: result};
        }
        res.json(respuesta)
    } catch(error){
        console.error(`Error: ${error}`);
    }
}

module.exports = {
    getProfile,
    putProfile,
    putPassword,
    putAvatar
};