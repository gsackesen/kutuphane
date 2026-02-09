const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => console.log('Veri tabanına bağlanıldı'))
    .catch(err => console.log('HATA',err));

