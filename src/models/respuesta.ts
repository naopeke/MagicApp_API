export class Response {
    constructor(
        public err?: string,
        public code?: string,
        public message?: string,
        public data?: any
       ){}
}
