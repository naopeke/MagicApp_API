import { User } from "./user";

export class Event {

    constructor(
        public id_event?: number,

        public nameEvent?: string,
        public descriptionEvent?: string,
        public date?: Date,
        public hour?: string,
        public place?: string,
        public direction?: string,
        public participation?: boolean,
        public id_user?: number,
        public participants?: User[]

        ) { }

}