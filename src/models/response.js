class Response {
    constructor( err, code, message, data){
        this.err = err;
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
module.exports = Response;