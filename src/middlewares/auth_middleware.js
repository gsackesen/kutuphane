const oturumAcilmis=function(req,res,next){
    if(req.isAuthenticated()){
         return next();
    }else{
        //res.render('login',{user:req.user,layout:'./layouts/main_layout.ejs',success_message:[{msg:'pleaselogin'}]});        
        res.render('index',{user:req.user,layout:'./layouts/main_layout.ejs'});        
    }
};

const oturumAcilmamis=function(req,res,next){
   
    if(!req.isAuthenticated()){       
        //return res.redirect('/login');
        return next();
    } /*else{
         // res.redirect('/login'); 
    }  */
         
}

const oturumKontrol = (req, res, next) => {
  if (req.isAuthenticated) {
    req.isLoggedIn = true;
  } else {
    req.isLoggedIn = false;
  }
  next();
};

module.exports={
    oturumAcilmis,
    oturumAcilmamis,
    oturumKontrol    
}