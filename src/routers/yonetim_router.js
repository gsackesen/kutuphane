const router = require('express').Router();
const yonetimController= require('../controllers/yonetim_controller');
const mainController= require('../controllers/main_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const multerConfig = require('../config/multer_config');
const validatorMiddleware = require('../middlewares/validation_middleware');
const roleMiddleware = require('../middlewares/role_middleware');


router.get('/',authMiddleware.oturumAcilmis, mainController.menuGoster );
router.get('/profil',authMiddleware.oturumAcilmis, yonetimController.profilSayfasiniGoster);
router.post('/profil-guncelle',authMiddleware.oturumAcilmis,multerConfig.single('avatar'),yonetimController.profilGuncelle);
router.get('/administration',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), yonetimController.adminSayfasiniGoster);
router.post('/userguncelle',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), yonetimController.adminUserFill);
router.get('/resetpassword/:id',authMiddleware.oturumAcilmis, roleMiddleware.authorizeRoles('GG_Admin'),yonetimController.resetPasswordFormuGoster);
router.post('/resetpassword/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), validatorMiddleware.validateNewPassword(),yonetimController.resetPassword);

router.get('/edit-user/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), yonetimController.userFormuGoster);
router.post('/edit-user/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'),validatorMiddleware.validateEditUser(), yonetimController.editUser);

router.get('/addnewuser', authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'),yonetimController.newUserFormuGoster);
router.post('/addnewuser',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'),validatorMiddleware.validateNewUser(), yonetimController.newUserKaydet);

router.post('/delete-user/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), yonetimController.deleteUser);


module.exports = router;
