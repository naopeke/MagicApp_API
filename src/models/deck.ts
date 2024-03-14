import { Card } from "./card";

export class Deck {
    constructor(
        public id_deck?: number,
        public nameDeck?: string,
        public nameUser?: string,
        public scores?: number[], 
        public mediaScore?: number,
        public cards?: Card[],
       ){}
}

// en realidad deberia ser el id_user, pero pongo name por ahora hasta BBDD