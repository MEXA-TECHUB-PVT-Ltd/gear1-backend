const router = require('express').Router();
const controller = require('../controllers/blockUserController');

router.post('/addOrRemove', controller.addOrRemove);
router.get('/getByUser', controller.getByUser);
router.get('/checkBlockedUser', controller.checkBlockedUser);

module.exports = router;
