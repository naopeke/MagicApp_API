const { Router } = require ('express');
const router = Router();
const userCtrl = require('../controller/user.controller');



router.post('/register', userCtrl.registerUser);

router.post('/login', userCtrl.loginUser);



// *NOTE -  Registrar
// router.post('/register', )

// *NOTE -  Login
// router.post('/loginUser', )

module.exports = router;

