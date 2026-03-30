const router = require('express').Router();
const yonetimController= require('../controllers/yonetim_controller');
const mainController= require('../controllers/main_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const multerConfig = require('../config/multer_config');


router.get('/',authMiddleware.oturumAcilmis, mainController.menuGoster );
router.get('/profil',authMiddleware.oturumAcilmis, yonetimController.profilSayfasiniGoster);
router.post('/profil-guncelle',authMiddleware.oturumAcilmis,multerConfig.single('avatar'),yonetimController.profilGuncelle);
router.get('/administration',authMiddleware.oturumAcilmis, yonetimController.adminSayfasiniGoster);

module.exports = router;
