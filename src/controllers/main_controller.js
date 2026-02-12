
const passport = require ('passport');
require ('../config/passport_local')(passport);
/*
const {validationResult}=require ('express-validator');
const User = require ('../models/user_model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
*/

const menuGoster = (req,res,next)=>{
    res.render('index',{layout:'./layout/main_layout.ejs'});
    
};

module.exports = {
    menuGoster,    
};