const router = require('express').Router();
const mainController = require('../controllers/main_controller');
const authMiddleware = require('../middlewares/auth_middleware');
const roleMiddleware = require('../middlewares/role_middleware');
const multerConfig = require('../config/multer_config');
const validatorMiddleware = require('../middlewares/validation_middleware');



// Ortak kontrol middleware'i
router.get('/', authMiddleware.oturumAcilmis, (req, res, next) => {

  if (authMiddleware.oturumAcilmis) {
    return mainController.kitaplarSayfasiniGoster(req, res, next);
  } else {
    return mainController.menuGoster(req, res, next);
  }
});

router.get('/kitapekle',authMiddleware.oturumAcilmis ,roleMiddleware.authorizeRoles('GG_Admin', 'GG_Operator'), mainController.kitapEkleSayfasiniGoster);
router.post('/kitapekle',authMiddleware.oturumAcilmis,multerConfig.coverUpload.single('cover'),mainController.kitapEkle);

router.get('/kitapduzenle/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin','GG_Operator'), mainController.editBookFormuGoster);
router.post('/kitapduzenle/:id',authMiddleware.oturumAcilmis,multerConfig.coverUpload.single('cover'),roleMiddleware.authorizeRoles('GG_Admin', 'GG_Operator'),validatorMiddleware.validateBook(), mainController.editBook);

router.post('/delete-book/:id',authMiddleware.oturumAcilmis,roleMiddleware.authorizeRoles('GG_Admin'), mainController.deleteBook);

router.get('/kitapdetay/:id',authMiddleware.oturumAcilmis,mainController.kitapDetay );




module.exports = router;