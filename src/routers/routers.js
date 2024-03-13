const { Router } = require ('express');
const router = Router();


router.get('/', (req, res) => {
    res.send('API DESPLEGADA');
});
// // router.get('/', userCtrl.registerUser);


module.exports = router;