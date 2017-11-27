var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gamstSchema = new Schema({
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now  },
    noschema: mongoose.Schema.Types.Mixed    
});

module.exports = mongoose.model('gamst', gamstSchema);