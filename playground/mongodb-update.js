const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://localhost:27017/TodoApp", (error, db) => {
    if(error) {
        return console.log("Error Connecting to DB");
    }
    console.log("Connection to MongoDB Successful");

    db.collection("Todos").findOneAndUpdate({
        _id: new ObjectID("5a251a6841da3c41e45b53e2")
    }, {
        $set: {completed: false}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    }, (err) => {
        console.log("there was an error updating", error);
    });

    db.collection("Users").findOneAndUpdate({_id: new ObjectID("5a25172c25a4bc6ca2d95163")}, {
        $set: {name: "Gibran"},
        $inc: {age: 1}
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
    // db.close();

});