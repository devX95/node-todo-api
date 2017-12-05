var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds129926.mlab.com:29926/todoapp" || "mongodb://localhost:27017/TodoApp", {
    useMongoClient: true
});

module.exports = {mongoose};