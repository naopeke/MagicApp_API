export class Card {

    constructor(
        public id_card?: string,
        public id_user?: number,
        public image_uris?: string,
        public name?: string,
        public type_line?: string,
        public oracle_text?: string,
        public color_identity?: string[],
        public legalities?: any, /* object*/
        public prices?: number,
        public set_name?: string,
        public set_type?: string,
        public quantity: number = 1
 
        ) { }
}