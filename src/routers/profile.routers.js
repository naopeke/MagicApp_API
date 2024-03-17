const { Router } = require ('express');
const router = Router();
const profileCtrl = require('../controller/profile.controller');

router.put('/profile/general', profileCtrl.putProfile);
router.put('/profile/password', profileCtrl.putPassword);
router.put('/profile/avatar', profileCtrl.putAvatar);



// *NOTE -  Perfil

//router.get('/profile/:id_user', )
//router.put('/profile/datos', )
//routers.put('profile/contrasena' )

module.exports = router;