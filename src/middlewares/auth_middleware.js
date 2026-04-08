const oturumAcilmis=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.render('login',{user:req.user,layout:'./layouts/main_layout.ejs',success_message:[{msg:'pleaselogin'}]});        
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

module.exports={
    oturumAcilmis,
    oturumAcilmamis
}