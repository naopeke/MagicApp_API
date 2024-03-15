const { Router } = require ('express');
const router = Router();
const userCtrl = require('../controller/user.controller.js');

router.post('/register', userCtrl.registerUser);

router.post('/login', userCtrl.loginUser);

module.exports = router;

