const mongoose= require('mongoose');

const BookSchema = new mongoose.Schema(
    {
        yazaradi: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        kitapadi: {
            type: String, 
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        cover: {
            type: String,
            required: false, 
            default:'Empty_Default.png'            
        },
         yayinevi: {
            type: String, 
            required: false,
            trim: true,            
            default:'Bilinmeyen'  
        },
        kategori: {
            type: String, 
            required: false,
            trim: true,            
            default:'Bilinmeyen'  
        },
        dil: {
            type: String, 
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30,
            default:'Türkçe'  
        },
        ISBN: {
            type: String, 
            required: false,
            trim: true,           
            default:'1111111111111'  
        },
        notlar: {
            type: String, 
            required: false,
            trim: true,          
            maxlength: 200,            
        },
    },{collection:'kitaplar',timestamps:true});

const Book=mongoose.model('Book',BookSchema);

module.exports=Book;
