const { pool } =  require('../database');
const { format } = require('date-fns');

const getAllUserEvents = async(req, res) => {
    let respuesta;
    try{
        let id_user = req.params.id_user

        let getEvents = `SELECT userEvent.id_user, userEvent.creator, magydeck.evento.*
        FROM magydeck.userEvent
        JOIN magydeck.evento ON (userEvent.id_event = evento.id_event)
        WHERE userEvent.id_user = ? 
        ORDER BY evento.date ASC`

        let [result] = await pool.query(getEvents, id_user)
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });
        console.log(result);

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se han encontrado eventos próximos en los que participes'}
        }else{
            respuesta = {error: false, codigo: 200, mensaje: 'Eventos recuperados', data: result}
        }
        
        res.json(respuesta)
        
    }
    catch (error){
        console.error(`Error: ${error}`);
    }
}


const getUserEventsForDate = async(req, res) => {
    let respuesta;
    try{
        let id_user = req.params.id_user;
        let date = req.params.date; 

        let getEvents = `SELECT userEvent.id_user, userEvent.creator, magydeck.evento.*
        FROM magydeck.userEvent
        JOIN magydeck.evento ON (userEvent.id_event = evento.id_event)
        WHERE userEvent.id_user = ? 
        AND evento.date = ?
        ORDER BY evento.date ASC`

        let [result] = await pool.query(getEvents, [id_user, date])
        result.forEach(evento => {
            evento.date = format(new Date(evento.date), 'yyyy-MM-dd')
            evento.hour = evento.hour.slice(0, 5); 
        });
        console.log(result);

        if(result.length == 0){
            respuesta = {error: true, codigo: 200, mensaje: 'No se han encontrado eventos próximos en los que participes'}
        }else{
            respuesta = {error: false, codigo: 200, mensaje: 'Eventos recuperados', data: result}
        }
        
        res.json(respuesta)
        
    }
    catch (error){
        console.error(`Error: ${error}`);
    }
}



// const addMyEvent = async (req, res, next) => {
//     try {
//         console.log('add cards try');
//     } catch {
//         console.log('add cards catch');
//     }
// }


module.exports = {
    getAllUserEvents,
    getUserEventsForDate, 
    // addMyEvent
};



// *NOTE - CALENDARIO
// router.get('/calendario, ) saber eventos tanto true como false en participation 
// router.post('/calendario, ) añadir evento indicando mi id_user
  // parametro de la funcion (id_user, Event) por body
// router.put('/calendario, ) modificar p<rticipacion del evento(pasar participation a false)
// router.delete('/calendario, ) eliminar evento solo mi id_user de loggin coincide con del creador