const User= require('../models/user_model');

const anaSayfayiGoster = function(req,res,next){
    res.render('index',{layout:'./layout/yonetim_layout.ejs'});
}

const profilSayfasiniGoster = function(req,res,next){

    res.render('profil',{user:req.user,layout:'./layout/yonetim_layout.ejs'});
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
          res.redirect("/yonetim/profil");
        };
       
        
    }
    catch(err){
        console.log(err);
    };
   
}

module.exports={
    anaSayfayiGoster,
    profilSayfasiniGoster,
    profilGuncelle
}