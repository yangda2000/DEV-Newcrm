var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({   
    title: String,
    author: String,
    published_date: { type: Date, default: Date.now  },
    noschema: mongoose.Schema.Types.Mixed    
});

module.exports = mongoose.model('book', bookSchema);
