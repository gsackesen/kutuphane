
const LocalStrategy = require('passport-local').Strategy;
const User  = require('../models/user_model');
const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (passport){
    const options = {
        usernameField: 'mail',
        passwordField: 'sifre',
        
    };
    passport.use(new LocalStrategy(options,async (mail,sifre,done)=>{
        try{

            const _bulunanUser = await User.findOne({mail});           
            if (!_bulunanUser){
                return done(null,false,{message:'User not found'});
            }

            

            const sifreKontrol=bcrypt.compare(sifre,_bulunanUser.sifre);
            
            if (!sifreKontrol){
                return done(null,false,{message:'Password is not correct'});
            }else{
                if (_bulunanUser && _bulunanUser.emailAktif==false){
                    return done(null,false,{message:'Please register your mail'});
                }else{
                    return done(null,_bulunanUser);
                };                                
            };           

        }catch(err){
            done(err);
        }
    }));
};

passport.serializeUser(function(user, done){
   // console.log('sessiona kaydedildi'+user.id);  
    done(null, user.id);     
});
  
passport.deserializeUser(async function(id, done) {
    const user= await User.findById(id); 
    if (!user) {done(err, null)} else {done(null,user);}   
  
});