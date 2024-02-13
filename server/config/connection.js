const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://agrastp:glasses@cluster0.hq8msmy.mongodb.net/?retryWrites=true&w=majority');

module.exports = mongoose.connection;
