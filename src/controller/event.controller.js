//const { connection } =  require('../database');
const {pool} = require("../database");
const Evento = require("../models/evento");
const User = require("../models/user");
const Response = require("../models/response");


// Devuelve todos los eventos
const getAllEvents = async (req, res, next) => {
    
    console.log("SE LLAMA AL GET_ALL_EVENTS");

    let sql_AllEvents = "SELECT e.*, u_creador.*"+ 
    "FROM evento e " + 
    "JOIN userEvent eu ON e.id_event = eu.id_event "+
    "JOIN user u_creador ON eu.id_user = u_creador.id_user";

    // SQL -->SELECT e.*, u_participante.*, u_creador.id_user
    // FROM evento e
    // JOIN userEvent eu ON e.id_event = eu.id_event
    // JOIN user u_participante ON eu.id_user = u_participante.id_user //Hasta esta linea optiene datos del eventos + datos de los participantes
    // JOIN user u_creador ON eu.id_user = u_creador.id_user WHERE participation = 1 //Quitando la de arriba y poniendo esta se recupera evento y su creador.

    let respuesta;
    let eventos=[];

    try {
        let [result] = await pool.query(sql_AllEvents);
        console.log(result);

        //Generamos el objeto que devemos devolver
        for(let i=0; i<result.length; i++){

            //console.log(typeof(result[i].nameEvent));
            let event = {"id":result[i].id_event,"title":result[i].nameEvent,"date":result[i].date, "hour":result[i].hour, "place":result[i].place,"descriptionEvent":result[i].descriptionEvent, "direction":result[i].direction, "creator":{"id_user":result[i].id_user, "nameUser":result[i].nameUser , "avatar":result[i].avatar}};
            console.log(event);
            // let event = new Event(result[i].id_event, result[i].nameEvent, result[i].date, result[i].hour, result[i].place, result[i].descriptionEvent, result[i].direction, new User(null,result[i].nameUser, null, null,null,null,null));
            console.log(event);
            eventos.push(event);

        }
        console.log(eventos);
        respuesta = new Response(false, 200, null, eventos);
        res.send(respuesta);

    } catch(err) {
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// Devuelve solo mis eventos
const getMyEvents = async (req, res, next) => {

    console.log("SE LLAMA AL GET_MYEVENTS");

    console.log(req.params.id_user);

    let sql_AllEvents = "SELECT e.*, u_creador.*"+ 
    "FROM evento e " + 
    "JOIN userEvent eu ON e.id_event = eu.id_event "+
    "JOIN user u_creador ON eu.id_user = u_creador.id_user WHERE eu.id_user = ? AND eu.creator = 1";

    let respuesta;
    let eventos=[];

    try {
        let [result] = await pool.query(sql_AllEvents,[req.params.id_user]);
        console.log(result);

        //Generamos el objeto que devemos devolver
        for(let i=0; i<result.length; i++){

            let event = {"id":result[i].id_event,"title":result[i].nameEvent,"date":result[i].date, "hour":result[i].hour, "place":result[i].place,"descriptionEvent":result[i].descriptionEvent, "direction":result[i].direction, "creator":{"id_user":result[i].id_user, "nameUser":result[i].nameUser, "avatar":result[i].avatar}};
            console.log(event);
            //let event = new Event(result[i].id_event, result[i].nameEvent, result[i].date, result[i].hour, result[i].place, result[i].descriptionEvent, result[i].direction, new User(null,result[i].nameUser, null, null,null,null,null));
            console.log(event);
            eventos.push(event);

        }
        console.log(eventos);

        respuesta = new Response(false, 200, null, eventos);
        res.send(respuesta);

    } catch(err) {
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}


//CREAR EVENTO
//Tenemos todos los datos del evento y del usuario logueado que es quien pulsa en crear evento
const addMyEvent = async (req, res, next) => {

    //Hay que cambiar cosas en el modelo de evento
    let evento = new Evento(null, req.body.title, req.body.date, req.body.hour, req.body.place, req.body.description, req.body.direction, new User(req.body.creator.id_user,null, null, null,null,null,null));
    let params = [evento.title, evento.descriptionEvent, evento.date, evento.hour, evento.place, evento.direction];

    let respuesta;

console.log(evento);

    let sql_InsertEvent = "INSERT INTO evento(nameEvent, descriptionEvent, date, hour, place, direction) VALUES (?,?,?,?,?,?)";
    let sql_InsertUserEvent = "INSERT INTO userEvent (id_event, id_user, creator) VALUES (?, ?, 1);";

    //Tenemos que realizar una inserción en eventos, recoger ese evento para insertar en users_events
    try {
        let [result] = await pool.query(sql_InsertEvent,params);
        let idEventoInsertado = result.insertId;
        console.log(result);
        console.log(idEventoInsertado);

        let [result2] = await pool.query(sql_InsertUserEvent,[idEventoInsertado, evento.creator.id_user]);
        console.log(result2);

        evento.id = idEventoInsertado;
        respuesta = new Response(false, 200, "El evento se inserta correctamente", evento);
        
        res.send(respuesta);
    } catch(err){
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// EDITA UN EVENTO
// Este método se llama al pulsar en la pluma de un evento, por lo que tenemos todos los datos asociados al evento, recibimos esos datos a traves del body
const editMyEvent = async (req, res, next) => {

    console.log("SE LLAMA AL EDITAR EVENTO");

    console.log(req.body.date);
    console.log(req.body.hour);

    let evento = new Evento(req.body.id, req.body.title, req.body.date, req.body.hour, req.body.place, req.body.description, req.body.direction, null);
    let params = [evento.nameEvent, evento.descriptionEvent, evento.date, evento.hour, evento.place, evento.direction, evento.id];

    let sql_UpdateEvent = "UPDATE evento SET nameEvent = COALESCE(?, nameEvent), descriptionEvent = COALESCE (?, descriptionEvent), " + 
    "date = COALESCE(?, date), hour = COALESCE(?, hour), place = COALESCE(?, place), direction = COALESCE(?, direction) WHERE id_event = ? "; 

    let respuesta;

    try {
        let[result] = await pool.query(sql_UpdateEvent, params);
        console.log(result);

        respuesta = new Response(false, 200, "El evento se actualiza correctamente", null);

        res.send(respuesta);
    } catch (err) {
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// BUSCA POR ID_EVENT E ID_USER EN LA TABLA DE ASOCIACION EVENT_USER SI EXISTE, LO ELIMINA, SI NO, TE AÑADE.
// Se llama desde el bóton participar del evento, por lo que tenemos el id_evento y el usuario logueado (id_user)
const editParticipation = async (req, res, next) => {

    console.log("SE LLAMA AL EDITAR PARTICIPACIÓN");
    console.log(req.query.id_event);
    console.log(req.query.id_user);

    let respuesta;
    let sqlFind_UserEvent = "SELECT id_user, id_event FROM userEvent WHERE id_event = ? AND id_user = ?";
    let sqlDelete_UserEvent = "DELETE FROM userEvent WHERE id_event = ? AND id_user = ?";
    let sqlCreate_UserEvent = "INSERT INTO userEvent (id_event, id_user, creator) VALUES (?, ?, 0);";

    try {
        let [resultFind] = await pool.query(sqlFind_UserEvent,[req.query.id_event, req.query.id_user]);
        console.log(resultFind);

        if(resultFind.length > 0)
        {
            let [resultDelete] = await pool.query(sqlDelete_UserEvent,[req.query.id_event, req.query.id_user]);
            console.log(resultDelete);

            respuesta = new Response(false, 200, "Dejas de participar en el evento", null);
        }else{
            let [resultCreate] = await pool.query(sqlCreate_UserEvent,[req.query.id_event, req.query.id_user]);
            console.log(resultCreate);
            respuesta = new Response(false, 200, "Participas en el evento", null);
        }

        res.send(respuesta);

    } catch(err) {
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// ELIMINA UN EVENTO
// Este método se llama al pulsar en la calavera de un evento, por lo que tenemos el id del evento, recibimos ese id por query param
const deleteMyEvent = async (req, res, next) => {    

    console.log("SE LLAMA AL DELETE EVENT")
    console.log(req.query.id_event);

    let respuesta;

    let sqlDelete_UserEvent = "DELETE FROM userEvent WHERE id_event = ?";
    let sqlDelete_Event = "DELETE FROM evento WHERE id_event = ?";

    try {
        //Como se llama desde el propio evento no hace falta comprobar si existe
        //No falla si no existe el evento

        let [result] = await pool.query(sqlDelete_UserEvent,[req.query.id_event]);
        let [result2] = await pool.query(sqlDelete_Event,[req.query.id_event]);

        respuesta = new Response(false, 200, "Se elimina el evento correctamente", null);

        res.send(respuesta);

    } catch(err) {
        console.log(err);
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
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
    getAllEvents, //todo Ok
    getMyEvents, //todo Ok
    // getOthersEvents,
    addMyEvent, //todo Ok
    editMyEvent, //todo Ok
    editParticipation, //todo Ok
    deleteMyEvent //todo Ok
};