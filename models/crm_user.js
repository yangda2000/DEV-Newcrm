var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var crm_user_Schema = new Schema({
    delflag: { type: String, default: "N"},        
    descript: [mongoose.Schema.Types.Mixed],
    formid: String,
    name: String,
    regdate: { type: Date, default: Date.now},
    siteurl: String,
    customscript: String,
    altid: String,
    id: String,
    accountkind: {type: String, default: "COM"},
    password: String,
    status: { type: String, default: "NOMAL"}
});

crm_user_Schema.plugin( autoIncrement.plugin , { model : 'crm_user' , field : 'index' , startAt : 1 });
module.exports = mongoose.model('crm_user', crm_user_Schema);