var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var crm_user_Schema = new Schema({
    DELFLAG: { type: String, default: "N"},        
    DESCRIPT: [mongoose.Schema.Types.Mixed],
    FORMID: String,
    NAME: String,
    REGDATE: { type: Date, default: Date.now},
    SITEURL: String,
    CUSTOMSCRIPT: String,    
    ID: String,
    ACCOUNTKIND: {type: String, default: "COM"},
    PASSWORD: String,
    STATUS: { type: String, default: "NOMAL"}
});

crm_user_Schema.plugin( autoIncrement.plugin , { model : 'crm_user' , field : 'index' , startAt : 1 });
crm_user_Schema.plugin( autoIncrement.plugin , { model : 'crm_user' , field : 'ALTID' , startAt : 1 }); 
module.exports = mongoose.model('crm_user', crm_user_Schema);