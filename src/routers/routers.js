const { Router } = require ('express');
const router = Router();
const bookCtrl = require('../controller/book.controller');

router.get('/', bookCtrl.getBook);
router.post('/', bookCtrl.postBook);
router.put('/', bookCtrl.putBook);
router.delete('/', bookCtrl.deleteBook);
router.get('*', bookCtrl.errorBook);

module.exports = router;