const {body}=require('express-validator');



const validateNewUser = () => {
    return[
        body('mail')
            .trim()
            .isEmail().withMessage('mailnotvalid'),
        body('ad')
            .trim()
            .isLength({min:3}).withMessage('nameerror1')
            .isLength({max:30}).withMessage('nameerror2'),
        body('soyad')
            .trim()
            .isLength({min:3}).withMessage('surnameerror1')
            .isLength({max:30}).withMessage('surnameerror2'),
        body('sifre')
            .trim()
            .isLength({min:6}).withMessage('pwerror1')
            .isLength({max:20}).withMessage('pwerror2'),
        body('resifre')
            .trim()    
            .custom((value,{req})=>{
                if(value!==req.body.sifre){
                    throw new Error('pwerror3');
                }
                return true;
            })
        ];
};

const validateEditUser = () => {


    
    return[
        body('mail')
            .trim()
            .isEmail().withMessage('mailnotvalid'),
        body('ad')
            .trim()
            .isLength({min:3}).withMessage('nameerror1')
            .isLength({max:30}).withMessage('nameerror2'),
        body('soyad')
            .trim()
            .isLength({min:3}).withMessage('surnameerror1')
            .isLength({max:30}).withMessage('surnameerror2'),        
        ];
};



const validateLogin = () => {
    return[
        body('mail')
            .trim()
            .isEmail().withMessage('mailnotvalid'),        
        body('sifre')
            .trim()
            .isLength({min:6}).withMessage('pwerror1')
            .isLength({max:20}).withMessage('pwerror2'),
        ];
        
};

const validateMail = () => {
    return[
        body('mail')
            .trim()
            .isEmail().withMessage('mailnotvalid'),        
        ];
};
const validateNewPassword = () => {
    return[        
        body('sifre')
            .trim()
            .isLength({min:6}).withMessage('pwerror1')
            .isLength({max:20}).withMessage('pwerror2'),
        body('resifre')
            .trim()    
            .custom((value,{req})=>{
                if(value!==req.body.sifre){
                    throw new Error('pwerror3');
                }
                return true;
            })
        ];
};




const validateBook = () => {
    {
         return[
        body('yazaradi')
            .trim()
            .isLength({min:3}).withMessage('nameerror1')
            .isLength({max:30}).withMessage('nameerror2'),
        body('kitapadi')
            .trim()
            .isLength({min:3}).withMessage('nameerror1')
            .isLength({max:30}).withMessage('nameerror2'),
        body('dil')
            .trim()
            .isLength({min:3}).withMessage('nameerror1')
            .isLength({max:30}).withMessage('nameerror2'),
        body('notlar')
            .trim()            
            .isLength({max:200}).withMessage('nameerror2'),
        ];
    };
};       
       
       

module.exports ={
    validateNewUser,
    validateLogin,
    validateMail,
    validateNewPassword,
    validateEditUser,
    validateBook
};