const router = require('express').Router();
const mainController = require('../controllers/main_controller');

//const validatorMiddleware = require('../middlewares/validation_middleware');
const authMiddleware = require('../middlewares/auth_middleware');

router.get('/',mainController.menuGoster);
//router.post('/');  

module.exports = router;