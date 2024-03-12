const { connection } =  require('../database');

const registerUser = async (req, res, next) => {
    try {
        console.log('register try');
    } catch {
        console.log('register catch');
    }
}

const loginUser = async (req, res, next) => {
    try {
        console.log('login try');
    } catch {
        console.log('login catch');
    }
}

const getUser = async (req, res, next) => {
    try {
        console.log('get user try');
    } catch {
        console.log('get user catch');
    }
}

const editUser = async (req, res, next) => {
    try {
        console.log('edit user try');
    } catch {
        console.log('edit user catch');
    }
}


module.exports = {
    registerUser,
    loginUser,
    getUser,
    editUser
};