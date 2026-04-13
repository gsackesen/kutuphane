const passport = require ('passport');
require ('../config/passport_local')(passport);






const menuGoster = (req,res,next)=>{

    res.render('index',{user:req.user,layout:'./layouts/main_layout.ejs'});

};

module.exports = {
    menuGoster
    
};