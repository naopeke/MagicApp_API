import { User } from "./user";

export class Evento {

    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public date?: Date,
        public hour?: string,
        public place?: string,
        public creator?: User,
        public direction?: string
        ) { }

}