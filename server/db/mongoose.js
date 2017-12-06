var mongoose = require("mongoose");

port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
if(port === 3000){
    mongoose.connect("mongodb://localhost:27017/TodoApp", {
        useMongoClient: true
    });
} else {
    mongoose.connect("mongodb://gibran:gib1995@ds129926.mlab.com:29926/todoapp", {
        useMongoClient: true
    });
}


module.exports = {mongoose};