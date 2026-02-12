const oturumAcilmis=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.render('login',{layout:'./layouts/auth_layout.ejs',success_message:[{msg:'Please Login'}]});        
    }
};

const oturumAcilmamis=function(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }else{
       // res.redirect('/yonetim');        
    }

}

module.exports={
    oturumAcilmis,
    oturumAcilmamis
}