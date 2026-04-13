const {validationResult}=require ('express-validator');
const User= require('../models/user_model');
const bcrypt = require('bcrypt');


/*
const anaSayfayiGoster = function(req,res,next){
    res.render('index',{layout:'./layout/main_layout.ejs'});
}
*/
const profilSayfasiniGoster = function(req,res,next){

    res.render('profil',{user:req.user,layout:'./layouts/main_layout.ejs'});
}



const profilGuncelle = async function(req,res,next){
    
    const guncelBilgiler={
        ad:req.body.ad,
        soyad:req.body.soyad,                        
    }
    try{
        if(req.file){
            guncelBilgiler.avatar=req.file.filename;
        }
        
        const sonuc=await User.findByIdAndUpdate(req.user.id,guncelBilgiler);
        if(sonuc){
           // req.flash('success_message',[{msg:'Profil güncellendi'}]);
          // console.log('update tamamlandı');
          // res.render('profil',{user:req.user,layout:'./layout/yonetim_layout.ejs'});
          res.redirect("/profil");
        };      
        
    }
    catch(err){
        //console.log(err);
    };
   
}
/*
async function getAllUsers() {
  try {
    // find({}) boş bir nesne alırsa tüm kayıtları döner
    const users = await User.find({});
   // res.render('administration',{users,layout:'./layout/main_layout.ejs'});
    //console.log("Kullanıcı Listesi:", users);
    return users;
  } catch (error) {    
    req.flash('error','dataerror' +":"+ error);
    res.redirect('/administration'); 
  }
}

*/

// Kullanıcıları çeken fonksiyon
async function getAllUsers() {
  try {
    // find({}) tüm kayıtları döndürür
    const users = await User.find({});
    return users; // sadece array döndür
  } catch (error) {
    req.flash('error','dataerror' +":"+ error);
    res.redirect('/administration'); 
  }
}

// Admin sayfasını gösteren controller
const adminSayfasiniGoster = async function(req, res, next) {
  try {
    const users = await getAllUsers(); // await ile çağır
    //console.log("Kullanıcı Listesi:", users);

    res.render('administration', {
      user: req.user,
      users: users, // array olarak gönder
      layout: './layouts/main_layout.ejs'
    });
  } catch (error) {
    req.flash('error', 'dataerror' + error);
    res.redirect('/administration');
  }
};


const adminUserFill = async function(req, res, next) {
   try {
    const users = await getAllUsers(); // await ile çağır
    //console.log("Kullanıcı Listesi:", users);

    res.render('administration', {
      user: req.user,
      selUser:req.selectedUser,
      users: users, // array olarak gönder
      layout: './layouts/main_layout.ejs'
    });
  } catch (error) {
    req.flash('error', 'dataerror' + error);
    res.redirect('/administration');
  }
};


async function resetPassword(req, res) {
  const {sifre,resifre} = req.body;
  const userId = req.params.id;
  
  

  const hatalar= validationResult(req);

  if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());                  
            res.redirect('/resetpassword/'+userId);       
        } else {
  
    try {
      const user = await User.findOne({_id:userId,emailAktif:true});

      
      // 1. Hash new password
      const hashedPassword= await bcrypt.hash(sifre,10);
      // 2. Save to database
      const sonuc= await User.findByIdAndUpdate(user._id ,{sifre:hashedPassword});

      //console.log ("sonuc:" + sonuc);
      const users = await getAllUsers();

      if (sonuc){
        req.flash('success_message',[{msg:'pupdatesuccess'}]);  
        //res.render('administration',{user:req.user,users,layout:'./layouts/main_layout.ejs'}); 
        
        res.redirect("/administration");
      }else{
        req.flash('error','pupdateerror');      
        res.render('administration',{user:req.user,users,layout:'./layouts/main_layout.ejs'});
      };    
    }catch (err) {
        req.flash('error','tryagain');
        res.render('administration',{user:req.user,users,layout:'./layouts/main_layout.ejs'});
      };
    };
  };

const resetPasswordFormuGoster=async(req,res,next) => {
    const userId = req.params.id;
    res.render('resetpassword',{user:req.user,userId,layout:'./layouts/main_layout.ejs'});   
};

const userFormuGoster=async(req,res) => {
    const userId = req.params.id;
    const selectedUser=await User.findById(userId);
    res.render('edit-user',{user:req.user,userId,selectedUser,layout:'./layouts/main_layout.ejs'});   
};

const editUser = async function(req,res){
    const userId = req.params.id;
    const { ad, soyad ,role,emailAktif} = req.body;
   
    const guncelBilgiler={
        ad,
        soyad,
        role,
        emailAktif
    }

    const hatalar= validationResult(req);
    
    
        if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());
                  
            res.redirect('/edit-user/'+userId);        
        } else {
   
            try{
                
                const sonuc=await User.findByIdAndUpdate(userId,guncelBilgiler);
                if(sonuc){
                  req.flash('success_message',[{msg:'userupdated'}]);          
                  res.redirect("/administration");
                };      
                
            }
            catch(err){
                //console.log(err);
            };
          };
};

const newUserFormuGoster=async(req,res) => {   
    
    res.render('addnewuser',{user:req.user,layout:'./layouts/main_layout.ejs'});   
};

const newUserKaydet=async(req,res) => {   

    
    const hatalar= validationResult(req);

    if (!hatalar.isEmpty()){
        req.flash('validation_error', hatalar.array());
        req.flash('mail',req.body.mail);
        req.flash('ad',req.body.ad);
        req.flash('soyad',req.body.soyad);
        req.flash('sifre',req.body.sifre);
        req.flash('resifre',req.body.resifre);
        res.redirect('/addnewuser');        
    } else {
        try {
            const _user = await User.findOne({mail:req.body.mail});
           
            if(_user && _user.emailAktif==true) {
                req.flash('validation_error', [{msg:'mailexist'}]);
                req.flash('mail',req.body.mail);
                req.flash('ad',req.body.ad);
                req.flash('soyad',req.body.soyad);
                req.flash('sifre',req.body.sifre);
                req.flash('resifre',req.body.resifre);
                res.redirect('/addnewuser');        
            }else if((_user && _user.emailAktif == false) || _user == null){
               
                if (_user){  
                    await User.findByIdAndDelete(_user._id);
                }
               
                const newUser= new User({
                    mail:req.body.mail,
                    ad:req.body.ad,
                    soyad:req.body.soyad,
                    role:req.body.role,
                    emailAktif:req.body.emailAktif,
                    sifre: await bcrypt.hash(req.body.sifre,10)
                });
                
                await newUser.save(); 

                req.flash('success_message',[{msg: 'usercreated'}]);
                res.redirect('/administration');                
            }
        }catch(err) {

        };
    };    
};  

const deleteUser=async (req, res) => {
    
  try {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_message', [{ msg: 'userdeleted' }]);
    res.redirect('/administration');
  } catch (err) {
    console.error(err);
    req.flash('error_message', [{ msg: 'userdeletefail' }]);
    res.redirect('/administration');
  }
};

module.exports={
  //  anaSayfayiGoster,
    profilSayfasiniGoster,
    profilGuncelle,
    adminSayfasiniGoster,
    getAllUsers,
    adminUserFill,
    resetPassword,
    resetPasswordFormuGoster,
    userFormuGoster,
    editUser,
    newUserFormuGoster,
    newUserKaydet,
    deleteUser
}