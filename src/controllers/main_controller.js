const {validationResult}=require ('express-validator');
const Book = require ('../models/book_model');
const passport = require ('passport');
require ('../config/passport_local')(passport);









const menuGoster = (req,res,next)=>{
    res.render('index',{user:req.user,layout:'./layouts/main_layout.ejs'});
};

async function getAllBooks() {
  try {
    // find({}) tüm kayıtları döndürür
    const books = await Book.find({});
    return books; // sadece array döndür
  } catch (error) {
    req.flash('error','dataerror' +":"+ error);
    res.redirect('/'); 
  }
};

const kitaplarSayfasiniGoster = async function(req, res, next) {
  try {
    const books = await getAllBooks(); // await ile çağır
    //console.log("Kullanıcı Listesi:", users);

    res.render('kitapindex', {
      user: req.user,
      books: books, // array olarak gönder
      layout: './layouts/main_layout.ejs'
    });
  } catch (error) {
    req.flash('error', 'dataerror' + error);
    res.redirect('/');
  }
};

const kitapEkleSayfasiniGoster = async function(req,res,next){
  const books = await getAllBooks();
    res.render('kitapekle',{user:req.user,books,layout:'./layouts/main_layout.ejs'});
}


const kitapEkle = async (req, res, next) => {

  const newBook = new Book({
    yazaradi: req.body.yazaradi,
    kitapadi: req.body.kitapadi,
    cover: req.file ? req.file.filename : null,
    yayinevi: req.body.yayinevi,
    kategori: req.body.kategori,
    dil: req.body.dil,
    ISBN: req.body.ISBN,
    notlar: req.body.notlar
  });

  const hatalar = validationResult(req);
  console.log(hatalar);

  if (!hatalar.isEmpty()) {
    req.flash('validation_error', hatalar.array());
    return res.redirect('/kitapekle');
  }

  try {
    await newBook.save();
    res.redirect("/");
  } catch (err) {
    console.error("Kitap eklenirken hata:", err);
    next(err);
  }
};


const editBookFormuGoster=async(req,res) => {
    const bookId = req.params.id;
    
    const selectedBook=await Book.findById(bookId);
    res.render('kitapduzenle',{user:req.user,bookId,selectedBook,layout:'./layouts/main_layout.ejs'});   
};

const editBook = async function(req,res){
    const bookId = req.params.id;
    const { yazaradi, kitapadi ,cover,yayinevi,kategori,dil,ISBN,notlar} = req.body;

    const guncelBilgiler={
        yazaradi,
        kitapadi,        
        yayinevi,
        kategori,
        dil,
        ISBN,
        notlar
    }
     
    const hatalar= validationResult(req);
    
       console.log(hatalar);
        if (!hatalar.isEmpty()){
            req.flash('validation_error', hatalar.array());
                  
            res.redirect('/kitapduzenle/'+bookId);        
        } else {
   
                try{
                  if(req.file){
                    guncelBilgiler.cover=req.file.filename;
                  }       
        
                 
                const sonuc=await Book.findByIdAndUpdate(bookId,guncelBilgiler);
                if(sonuc){
                  req.flash('success_message',[{msg:'bookupdated'}]);          
                  res.redirect("/");
                };      
                
            }
            catch(err){
                //console.log(err);
            };
          };
};
const deleteBook=async (req, res) => {
    
  try {
    await Book.findByIdAndDelete(req.params.id);
    req.flash('success_message', [{ msg: 'bookdeleted' }]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    req.flash('error_message', [{ msg: 'bookdeletefail' }]);
    res.redirect('/');
  }
};


const kitapDetay = async (req, res) => {
  const bookId = req.params.id;
  const bookDetails = await Book.findById(bookId);
  res.json(bookDetails);
};

module.exports = {
    menuGoster, 
    getAllBooks,
    kitaplarSayfasiniGoster,
    kitapEkleSayfasiniGoster,
    kitapEkle,
    editBookFormuGoster,
    editBook,
    deleteBook,
    kitapDetay   
};