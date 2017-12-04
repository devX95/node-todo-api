const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log("There was an error connect to Mongo Server", err);
    }
    console.log('Connection to MongoDB successful');

    //delete many
    // db.collection('Todos').deleteMany({text: "Drink water"}).then((result) => {
    //     console.log(result);
    // }, (error) => {
    //     console.log("There was an error deleting entries: ", error);
    // });

    //delete one
    // db.collection('Todos').deleteOne({text: "Drink water"}).then((result) => {
    //     console.log(result);
    // });

    //find one and delete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // });

    db.collection("Users").deleteMany({name: "Gibran"}).then((result) => {
        console.log(error);
    }, (error) => {
        console.log("Unable To delete: ", error);
    });

    db.collection("Users").findOneAndDelete({ 
        _id: new ObjectID("5a251f2e41da3c41e45b5535")
    }).then((result) => {
        console.log(result);
    }, (error) => {
        console.log("Unable to find one and delete: ", error);
    });

    //db.close();
});