const { Router } = require ('express');
const router = Router();
const exploraCtrl = require('../controller/explora.controller');

router.get('/profile/:id_user', getProfile);
router.put('/profile/datos', addProfile);
router.put('profile/contrasena', editProfile);



// *NOTE -  Perfil

//router.get('/profile/:id_user', )
//router.put('/profile/datos', )
//routers.put('profile/contrasena' )