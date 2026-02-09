const router = require('express').Router();
const authController = require('../controllers/auth_controller');
const validatorMiddleware = require('../middlewares/validation_middleware');
const authMiddleware = require('../middlewares/auth_middleware');


router.get('/login',authMiddleware.oturumAcilmamis, authController.loginFormuGoster);
router.post('/login',authMiddleware.oturumAcilmamis, validatorMiddleware.validateLogin(),authController.login);  

router.get('/forget-password',authMiddleware.oturumAcilmamis, authController.forgetPasswordFormuGoster);
router.get('/forget-password/',authMiddleware.oturumAcilmamis, authController.forgetPasswordFormuGoster);
router.post('/forget-password',authMiddleware.oturumAcilmamis,validatorMiddleware.validateMail(), authController.forgetPassword);


router.get('/register', authMiddleware.oturumAcilmamis,authController.registerFormuGoster);
router.post('/register',authMiddleware.oturumAcilmamis,validatorMiddleware.validateNewUser(), authController.register);

router.get('/verify',authController.verifyMail);

router.get('/reset-password/:id/:token',authController.yeniSifreLinki);
router.get('/reset-password',authController.yeniSifreFormuGoster);
router.post('/reset-password',validatorMiddleware.validateNewPassword(),authController.yeniSifreyiKaydet);

router.get('/logout',authMiddleware.oturumAcilmis, authController.logout);

module.exports = router;