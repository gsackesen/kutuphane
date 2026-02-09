const {validationResult}=require ('express-validator');
const User = require ('../models/user_model');
const passport = require ('passport');
require ('../config/passport_local')(passport);
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const yeniSifreFormuGoster=async(req,res,next) => {

    if (res.locals.id.length==1 && res.locals.token.length==1){
        res.render('new_password',{layout:'./layout/auth_layout.ejs'});
    }else{
        req.flash('validation_error', [{msg:'Please, click on the link in the mail. Token is not valid or expired.'}]);          
        res.redirect('/forget-password'); 
    };
        
};

const yeniSifreLinki=async(req, res, next) =>{
    const linktekiID = req.params.id;
    const linktekiToken = req.params.token;
     
    if (linktekiID && linktekiToken){
      
        const _bulunanUser = await User.findOne({_id:linktekiID,emailAktif:true});
        const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_bulunanUser.sifre;

        try {      
            jwt.verify(linktekiToken,secret,async(e,decoded)=>{
                if(e){
                    req.flash('error','Signature dismatch or expired');
                    res.redirect('/forget-password');
                }else{
                    
                    if (res.locals.validation_error.length>0){
                        req.flash('validation_error', res.locals.validation_error); 
                    };   
                    const sifre=res.locals.sifre;
                    const resifre=res.locals.resifre; 
                    if (sifre.length>0 && resifre.length>0) {
                        req.flash('sifre', sifre); 
                        req.flash('resifre', resifre); 
                    };    
                    
                    req.flash('id',linktekiID);
                    req.flash('token',linktekiToken);                   
                    
                    res.redirect('/reset-password');
                    
                    
                    /*const tokenIcindekiID=decoded.id;
                    const sonuc=await User.findByIdAndUpdate(tokenIcindekiID,{emailAktif:true});
                    if(sonuc){
                        req.flash('success_message',[{msg:'Mail successfully registered'}]);
                        res.redirect('/login');
                    }else{
                        req.flash('error','Please register the user again');
                        res.redirect('/login');
                    } */
                };
            });

        }catch (err) {
                    req.flash('error','Error, please try again');
                    res.redirect('/login');
        }


    }else{
        req.flash('validation_error', [{msg:'Please, click on the link in the mail. Token is not valid or expired.'}]);          
        res.redirect('/forget-password'); 
    };

};

const yeniSifreyiKaydet = async(req,res,next)=>{

    const hatalar= validationResult(req);
    
    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);       
        res.redirect('/reset-password/'+req.body.id +'/'+req.body.token);
    } else{
        const _bulunanUser = await User.findOne({_id:req.body.id,emailAktif:true});
        
        const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_bulunanUser.sifre;

        try {      
            jwt.verify(req.body.token,secret,async(e,decoded)=>{
                if(e){
                    req.flash('error','Signature dismatch or expired');
                    res.redirect('/forget-password');
                }else{
                    const hashedPassword= await bcrypt.hash(req.body.sifre,10);
                    const sonuc= await User.findByIdAndUpdate(req.body.id,{sifre:hashedPassword});

                    if (sonuc){
                        req.flash('success_message',[{msg:'Password has been updated successfully'}]);
                        res.redirect('/login');
                    }else{
                        req.flash('error','Password could not be updated. pls retry');
                        res.redirect('/forget-password/');
                    };                    
                };
            });

        }catch (err) {
                    req.flash('error','Error, please try again');
                    res.redirect('/login');
        }









        
    };

};
const loginFormuGoster = (req,res,next)=>{
    res.render('login',{layout:'./layout/auth_layout.ejs'});
    
};
const login= (req,res,next)=>{
    
    const hatalar= validationResult(req);
    
    req.flash('mail',req.body.mail);
    req.flash('sifre',req.body.sifre);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());                
        res.redirect('/login');        
    } else {
        passport.authenticate('local', {
                successRedirect:'/yonetim',
                failureRedirect: '/login',                
                failureFlash: true ,
        })(req,res,next);   
    }  
    
   
};

const forgetPasswordFormuGoster = (req,res,next)=>{
    res.render('forget_password',{layout:'./layout/auth_layout.ejs'});
};

const forgetPassword = async(req,res,next)=>{
    // console.log(req.body);
    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);        
        res.redirect('/forget-password');        
    } else {
        try {
            const _user = await User.findOne({mail:req.body.mail,emailAktif:true});

            if (_user) {
                
                //jwt işlemleri
                const jwtBilgileri = {
                    id: _user._id,
                    mail: _user.mail
                };            
                //console.log(jwtBilgileri);
                const secret=process.env.RESET_PASSWORD_JWT_SECRET+"-"+_user.sifre;
                const jwtToken=jwt.sign(jwtBilgileri,secret,{expiresIn:"1d"}); 
                
                //Mail Gönderme İşlemleri
                const url=process.env.WEB_SITE_URL+'reset-password/'+_user._id+'/'+jwtToken;

                let transporter =nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user:process.env.GMAIL_USER,
                        pass:process.env.GMAIL_SIFRE
                    }
                });

                await transporter.sendMail({
                    from:'NodeJS App',
                    to: _user.mail,
                    subject:'Password Reset',
                    text:'Please click link to reset your password '+url
                },(error,info)=>{
                    if (error){
                        console.log('Error'+error);
                    }
                   // console.log('Mail gönderildi');
                    //console.log(info);
                    transporter.close();
                });
                req.flash('success_message',[{msg: 'Please check your mailbox'}]);
                res.redirect('/forget-password');          




            }else {
                req.flash('validation_error', [{msg:'Email not registered or not activated'}]);
                req.flash('mail',req.body.mail);
                res.redirect('/forget-password');            
            };

               
            
        } catch(err) {


        };
    }   
    
};

const registerFormuGoster = (req,res,next)=>{
    //console.log(req.flash('validation_error'));
    res.render('register',{layout:'./layout/auth_layout.ejs'});
};

const register = async (req,res,next)=>{
    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);
        req.flash('ad',req.body.ad);
        req.flash('soyad',req.body.soyad);
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);
        res.redirect('/register');        
    } else {
        try {
            const _user = await User.findOne({mail:req.body.mail});
           
            if(_user && _user.emailAktif==true) {
                req.flash('validation_error', [{msg:'Email already exists'}]);
                req.flash('mail',req.body.mail);
                req.flash('ad',req.body.ad);
                req.flash('soyad',req.body.soyad);
                req.flash('sifre',req.body.sifre);
                req.flash('resifre',req.body.resifre);
                res.redirect('/register');        
            }else if((_user && _user.emailAktif == false) || _user == null){
               
                if (_user){  
                    await User.findByIdAndDelete(_user._id);
                }
               
                const newUser= new User({
                    mail:req.body.mail,
                    ad:req.body.ad,
                    soyad:req.body.soyad,
                    sifre: await bcrypt.hash(req.body.sifre,10)
                });
                
                await newUser.save();
                
                //jwt işlemleri
                const jwtBilgileri = {
                    id: newUser._id,
                    mail: newUser.mail
                };

                const jwtToken=jwt.sign(jwtBilgileri,process.env.CONFIRM_MAIL_JWT_SECRET,{expiresIn:"1d"});                

               // console.log(jwtToken);

                //Mail Gönderme İşlemleri
                const url=process.env.WEB_SITE_URL+'verify?id='+jwtToken;

               // console.log(url);

                let transporter =nodemailer.createTransport({
                    service: 'gmail',
                    auth:{
                        user:process.env.GMAIL_USER,
                        pass:process.env.GMAIL_SIFRE
                    }
                });

                

                await transporter.sendMail({
                    from:'NodeJS App',
                    to: newUser.mail,
                    subject:'Please confirm your mail to register your account',
                    text:'pls click link to confirm your registration '+url
                },(error,info)=>{
                    if (error){
                        console.log('Error'+error);
                    }
                   // console.log('Mail gönderildi');
                    //console.log(info);
                    transporter.close();
                });
                req.flash('success_message',[{msg: 'Please check your mailbox'}]);
                res.redirect('/login');                
            }
        }catch(err) {

        };
    };    
};

const logout= async (req, res,next)=>{
   /* req.logout(function(err) {
        if (err) { return next(err); }        
      });      
     
  //  delete req.session;
  // res.clearCookie('connect.sid');

    res.render('login',{layout:'./layout/auth_layout.ejs',success_message:[{msg:'Logout Success '}]});*/

    try {
        await req.logout(function(err){});           
        res.clearCookie("connect.sid"); 

        req.flash('success_message',[{msg: 'Logout Success'}]);
                res.redirect('/login');  
        
        //res.render('login',{layout:'./layout/auth_layout.ejs',success_message:[{msg:'Logout Success '}]});           
      } catch (error) {
        next();
     };     

};

const verifyMail=async (req, res, next) =>{
    const token=req.query.id;
    if (token){
        try {
            jwt.verify(token,process.env.CONFIRM_MAIL_JWT_SECRET,async(e,decoded)=>{
                if(e){
                    req.flash('error','Signature dismatch or expired');
                    res.redirect('/login');
                }else{
                    const tokenIcindekiID=decoded.id;
                    const sonuc=await User.findByIdAndUpdate(tokenIcindekiID,{emailAktif:true});
                    if(sonuc){
                        req.flash('success_message',[{msg:'Mail successfully registered'}]);
                        res.redirect('/login');
                    }else{
                        req.flash('error','Please register the user again');
                        res.redirect('/login');
                    }
                }

            });

        }catch (err) {
                    req.flash('error','Error, please try again');
                    res.redirect('/login');
        }
    }else{
        req.flash('error','Invalid Signature');
        res.redirect('/login');
    };
    

};



module.exports = {
    loginFormuGoster,
    forgetPasswordFormuGoster,
    registerFormuGoster,
    login,
    register,
    forgetPassword,
    logout,
    verifyMail,
    yeniSifreFormuGoster,
    yeniSifreyiKaydet,
    yeniSifreLinki
};