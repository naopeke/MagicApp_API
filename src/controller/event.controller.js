const { connection } =  require('../database');


const getAllEvents = async (req, res, next) => {
    
    let sqlEvent = "SELECT * FROM evento";
    console.log("SE LLAMA AL GET_ALL_EVENTS")

    try {
        let [result] = await pool.query(sql);
        console.log(result);
    } catch {
        console.log(result);
    }
}


const getMyEvents = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const getOthersEvents = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const addMyEvent = async (req, res, next) => {
    
    // let event = new Evento(null, req.body.title, req.body.description,req.body.date, req.body.hour, req.body.place, req.body.creator, req.body.direction);
    // try{
    //     let sql = "SELECT email FROM user WHERE email = '" + event.email + "'";
    //     let [email] = await pool.query(sql);
    //     if(email.length){
    //         res.err = true;
    //         res.message = "ya existe usuario";
    //     } else {
    //         let sql = "INSERT INTO user (name, last_name, email, photo, password)" + "VALUES ('" + user.name + "', '" + user.last_name + "', '" + user.email + "','" + user.photo + "','" + user.password + "')";
    //         await pool.query(sql);
    //         let event = "SELECT id_user FROM event WHERE email = '" + user.email + "'";
    //         let [id_user] = await pool.query(user);
    //         event.id_user = id_user[0].id_user;
    //         event.password = null;
    //         res.data = event;
    //     }
    //     res.send(res);
    //     // console.log('get decks try');
    // }catch(err){
    //     console.error(err);
    //     console.log('get decks catch');
    // }
}

const editMyEvent = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const editParticipation = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}

const deleteMyEvent = async (req, res, next) => {
    try {
        console.log('get decks try');
    } catch {
        console.log('get decks catch');
    }
}


// *NOTE - EVENTOS
// router.get('/eventos, ) aparezcan todos los eventos
// router.get('/eventos/?id_user, ) filtro para que aparezcan solo los eventos del usuario
// router.get('/eventos/??????, ) filtro para que aparezcan solo los eventos que NO son creados por el usuario

// router.post('/eventos, ) añadir evento con el id_user del logging
// router.put('/eventos, ) editar evento solo mi id_user de loggin coincide con del creador
// router.delete('/eventos, ) eliminar evento solo mi id_user de loggin coincide con del creador


module.exports = {
    getAllEvents,
    getMyEvents,
    getOthersEvents,
    addMyEvent,
    editMyEvent,
    editParticipation,
    deleteMyEvent
};