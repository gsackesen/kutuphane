const router = require('express').Router();
const yonetimController= require('../controllers/yonetim_controller');
const mainController= require('../controllers/main_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const multerConfig = require('../config/multer_config');
const validatorMiddleware = require('../middlewares/validation_middleware');


router.get('/',authMiddleware.oturumAcilmis, mainController.menuGoster );
router.get('/profil',authMiddleware.oturumAcilmis, yonetimController.profilSayfasiniGoster);
router.post('/profil-guncelle',authMiddleware.oturumAcilmis,multerConfig.single('avatar'),yonetimController.profilGuncelle);
router.get('/administration',authMiddleware.oturumAcilmis, yonetimController.adminSayfasiniGoster);
router.post('/userguncelle',authMiddleware.oturumAcilmis, yonetimController.adminUserFill);
router.get('/resetpassword/:id',authMiddleware.oturumAcilmis, yonetimController.resetPasswordFormuGoster);
router.post('/resetpassword/:id',authMiddleware.oturumAcilmis, validatorMiddleware.validateNewPassword(),yonetimController.resetPassword);

router.get('/edit-user/:id',authMiddleware.oturumAcilmis, yonetimController.userFormuGoster);
router.post('/edit-user/:id',authMiddleware.oturumAcilmis,validatorMiddleware.validateEditUser(), yonetimController.editUser);

router.get('/addnewuser', authMiddleware.oturumAcilmis,yonetimController.newUserFormuGoster);
router.post('/addnewuser',authMiddleware.oturumAcilmis,validatorMiddleware.validateNewUser(), yonetimController.newUserKaydet);

router.post('/delete-user/:id',authMiddleware.oturumAcilmis, yonetimController.deleteUser);


module.exports = router;
