const router = require('express').Router();
const controller = require('../controllers/helpController');

router.post('/send', controller.send);
router.get('/get', controller.get);
router.delete('/delete', controller.delete);
router.delete('/deleteAll', controller.deleteAll);

module.exports = router;
