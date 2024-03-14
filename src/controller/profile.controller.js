const { pool} =  require('../database');

const getProfile = async (req, res, next) => {
    try {
        console.log('get profile try');
    } catch {
        console.log('get profile catch');
    }
}

const addProfile = async (req, res, next) => {
    try {
        console.log('add profile try');
    } catch {
        console.log('add profile catch');
    }
}


const editProfile = async (req, res, next) => {
    try {
        console.log('add profile try');
    } catch {
        console.log('add profile catch');
    }
}

module.exports = {
    getProfile,
    addProfile,
    editProfile
};