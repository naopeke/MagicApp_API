class Event {
    constructor(id_event, nameEvent, date, hour, place, direction, participation, id_user, participants) { 
        this.id_event = id_event;
        this.nameEvent = nameEvent;
        this.date = date;
        this.hour = hour;
        this.place = place;
        this.direction = direction;
        this.participation = participation;
        this.id_user = id_user;
        this.participants = participants;
    }
}
module.exports = Event;