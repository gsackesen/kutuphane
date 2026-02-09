const mongoose= require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        ad: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        soyad: {
            type: String, 
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },
        avatar: {
            type: String, 
            default:'Empty_Default.png'            
        },

        mail: {
            type: String, 
            required: true, 
            unique: true,
            trim: true,
            lowercase: true            
        },
        emailAktif:{
            type: Boolean,
            default: false
        },
        sifre: {
            type: String,
            required: true,
            trim: true,
        }
    },{collection:'kullanicilar',timestamps:true});

const User=mongoose.model('User',UserSchema);

module.exports=User;
