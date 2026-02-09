
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const expressLayouts= require('express-ejs-layouts');
const session= require('express-session');
const app = express();
const flash = require('connect-flash');
const passport = require('passport');

//env değişkenlerini okuma
require('dotenv').config();

//template engine ayarları
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname,'src/uploads')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));
app.set('layout', false);
app.use(expressLayouts);
app.use(express.json());


//middleware formdan gelen değerlerin okunabilmesi için
app.use(express.urlencoded({ extended: true}));


//db bağlantısı
require('./src/config/database');

const MongoDBStore = require('connect-mongodb-session')(session);

const sesionStore = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
  collection: 'mySessions'
});

//session & Flash message middleware

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 
    },
    store: sesionStore
}));

app.use(flash());
app.use((req, res, next) => {    
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_message = req.flash('success_message');
    res.locals.login_error = req.flash('error');
    

    res.locals.mail = req.flash('mail');
    res.locals.ad = req.flash('ad');
    res.locals.soyad = req.flash('soyad');
    res.locals.sifre = req.flash('sifre');
    res.locals.resifre = req.flash('resifre');
    res.locals.id = req.flash('id');
    res.locals.token = req.flash('token');

    next();
});

app.use(passport.initialize());
app.use(passport.session());

//routers

const authRouter=require('./src/routers/auth_router');
const yonetimRouter=require('./src/routers/yonetim_router');


app.get('/', (req, res) => {
    res.json({mesaj:'Merhaba'});
});

app.use('/', authRouter);
app.use('/yonetim', yonetimRouter);

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
