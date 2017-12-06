var env = process.env.NODE_ENV || 'development';

if(env === "development") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
} else if(env === "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/test";
} else if(env === "production"){
    process.env.MONGODB_URI = "mongodb://gibran:gib1995@ds129926.mlab.com:29926/todoapp";
}