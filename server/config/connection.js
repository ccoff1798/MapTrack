const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ccoff1798:<password>@cluster0.tqh1oxa.mongodb.net/?retryWrites=true&w=majority');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maptrack');

module.exports = mongoose.connection;
