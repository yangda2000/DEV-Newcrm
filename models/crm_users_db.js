var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var crm_users_db_Schema = new Schema({   
    delflag: { type: String, default: "N"},
    regdate: { type: Date, default: Date.now  },
    data: { type: mongoose.Schema.Types.Mixed, trim: true}
});

// 1씩 증가하는 primary Key를 만든다
// model : 생성할 컬렉션 이름
// field : index , startAt : 1부터 시작
crm_users_db_Schema.plugin( autoIncrement.plugin , { model : 'crm_users_db' , field : 'index' , startAt : 1 });
module.exports = mongoose.model('crm_users_db', crm_users_db_Schema);


