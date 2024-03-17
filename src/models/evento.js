class Evento {
    constructor(id, title, date, hour, place, descriptionEvent, direction, creator) { 
        this.id = id;
        this.title = title;
        this.date = date;
        this.hour = hour;
        this.place = place;
        this.descriptionEvent = descriptionEvent;
        this.direction = direction;
        this.creator = creator;
    }
}
module.exports = Evento;