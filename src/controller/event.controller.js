//const { connection } =  require('../database');
const {pool} = require("../database");
const { format } = require('date-fns');
const Evento = require("../models/evento");
const User = require("../models/user");
const Response = require("../models/response");


// Devuelve todos los eventos
const getAllEvents = async (req, res, next) => {

    let sql_AllEvents = "SELECT e.*, u_creador.*"+ 
    "FROM evento e " + 
    "JOIN userEvent eu ON e.id_event = eu.id_event "+
    "JOIN user u_creador ON eu.id_user = u_creador.id_user WHERE e.date >=CURDATE() AND creator = 1";

    let respuesta;
    let eventos=[];

    try {
        let [result] = await pool.query(sql_AllEvents);
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });
        console.log(result);

        //Generamos el objeto que devemos devolver
        for(let i=0; i<result.length; i++){
            let event = {"id":result[i].id_event,"title":result[i].nameEvent,"date":result[i].date, "hour":result[i].hour, "place":result[i].place,"descriptionEvent":result[i].descriptionEvent, "direction":result[i].direction, "creator":{"id_user":result[i].id_user, "nameUser":result[i].nameUser , "avatar":result[i].avatar}};
            eventos.push(event);
        }
        respuesta = new Response(false, 200, null, eventos);
        res.send(respuesta);
    } catch(err) {
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// Devuelve solo mis eventos
const getMyEvents = async (req, res, next) => {

    let sql_AllEvents = "SELECT e.*, u_creador.*"+ 
    "FROM evento e " + 
    "JOIN userEvent eu ON e.id_event = eu.id_event "+
    "JOIN user u_creador ON eu.id_user = u_creador.id_user WHERE eu.id_user = ? AND eu.creator = 1 AND e.date >= CURDATE()";

    let respuesta;
    let eventos=[];

    try {
        let [result] = await pool.query(sql_AllEvents,[req.params.id_user]);
        console.log(result);
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });

        //Generamos el objeto que devemos devolver
        for(let i=0; i<result.length; i++){
            let event = {"id":result[i].id_event,"title":result[i].nameEvent,"date":result[i].date, "hour":result[i].hour, "place":result[i].place,"descriptionEvent":result[i].descriptionEvent, "direction":result[i].direction, "creator":{"id_user":result[i].id_user, "nameUser":result[i].nameUser, "avatar":result[i].avatar}};
            eventos.push(event);
        }
        respuesta = new Response(false, 200, null, eventos);
        res.send(respuesta);
    } catch(err) {
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}


//CREAR EVENTO
//Tenemos todos los datos del evento y del usuario logueado que es quien pulsa en crear evento
const addMyEvent = async (req, res, next) => {
    let evento = new Evento(null, req.body.title, req.body.date, req.body.hour, req.body.place, req.body.description, req.body.direction, new User(req.body.creator.id_user,null, null, null,null,null,null));
    let params = [evento.title, evento.descriptionEvent, evento.date, evento.hour, evento.place, evento.direction];

    let respuesta;

    let sql_InsertEvent = "INSERT INTO evento(nameEvent, descriptionEvent, date, hour, place, direction) VALUES (?,?,?,?,?,?)";
    let sql_InsertUserEvent = "INSERT INTO userEvent (id_event, id_user, creator) VALUES (?, ?, 1);";

    //Tenemos que realizar una inserción en eventos, recoger ese evento para insertar en users_events
    try {
        let [result] = await pool.query(sql_InsertEvent,params);
        let idEventoInsertado = result.insertId;
        let [result2] = await pool.query(sql_InsertUserEvent,[idEventoInsertado, evento.creator.id_user]);

        evento.id = idEventoInsertado;
        respuesta = new Response(false, 200, "El evento se inserta correctamente", evento);
        res.send(respuesta);
    } catch(err){
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// EDITA UN EVENTO
// Este método se llama al pulsar en la pluma de un evento, por lo que tenemos todos los datos asociados al evento, recibimos esos datos a traves del body
const editMyEvent = async (req, res, next) => {

    let evento = new Evento(req.body.id, req.body.title, req.body.date, req.body.hour, req.body.place, req.body.description, req.body.direction, null);
    let params = [evento.title, evento.descriptionEvent, evento.date, evento.hour, evento.place, evento.direction, evento.id];

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

    let respuesta;
    let sqlFind_UserEvent = "SELECT id_user, id_event FROM userEvent WHERE id_event = ? AND id_user = ?";
    let sqlDelete_UserEvent = "DELETE FROM userEvent WHERE id_event = ? AND id_user = ?";
    let sqlCreate_UserEvent = "INSERT INTO userEvent (id_event, id_user, creator) VALUES (?, ?, 0);";

    try {
        let [resultFind] = await pool.query(sqlFind_UserEvent,[req.query.id_event, req.query.id_user]);
        if(resultFind.length > 0)
        {
            let [resultDelete] = await pool.query(sqlDelete_UserEvent,[req.query.id_event, req.query.id_user]);
            respuesta = new Response(false, 200, "Dejas de participar en el evento", null);
        }else{
            let [resultCreate] = await pool.query(sqlCreate_UserEvent,[req.query.id_event, req.query.id_user]);
            respuesta = new Response(false, 200, "Participas en el evento", null);
        }
        res.send(respuesta);
    } catch(err) {
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

// ELIMINA UN EVENTO
// Este método se llama al pulsar en la calavera de un evento, por lo que tenemos el id del evento, recibimos ese id por query param
const deleteMyEvent = async (req, res, next) => {    
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
        respuesta = new Response(true, 400, null, err);
        res.send(respuesta);
    }
}

module.exports = {
    getAllEvents, //todo Ok
    getMyEvents, //todo Ok
    addMyEvent, //todo Ok
    editMyEvent, //todo Ok
    editParticipation, //todo Ok
    deleteMyEvent //todo Ok
};