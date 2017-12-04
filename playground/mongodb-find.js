// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Same as above

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) =>{
    if(error){
        return console.log("Unable To Connect To MongoDB server");
    }
    console.log("Connected to MongoDB server");

    // db.collection('Todos').find({}).toArray().then((docs)=>{
    //     console.log("Todos");
    //     console.log(JSON.stringify(docs, undefined, 2));

    // }, (err) => {
    //     console.log("Unable to print: ", err);
    // });

    //Return count
    // db.collection('Todos').find().count().then((count)=>{
    //     console.log("Todos");
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log("Unable to print: ", err);
    // });

    db.collection("Users").find({name: "Gibran"}).toArray().then((docs) => {
        console.log("Users");
        console.log(JSON.stringify(docs, undefined, 2));
    }, (error) => {
        console.log("Unable to find users: ", error);
    });

    //db.close();
});