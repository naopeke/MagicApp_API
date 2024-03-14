const { pool } =  require('../database');

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

const logoutUser = (req, res, next) => {
    res.json({ success: true });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};