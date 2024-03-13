const { Router } = require ('express');
const router = Router();
const profileCtrl = require('../controller/profile.controller');

router.get('/profile/:id_user', profileCtrl.getProfile);
router.put('/profile/datos', profileCtrl.addProfile);
router.put('profile/contrasena', profileCtrl.editProfile);



// *NOTE -  Perfil

//router.get('/profile/:id_user', )
//router.put('/profile/datos', )
//routers.put('profile/contrasena' )

module.exports = router;