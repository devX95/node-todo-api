// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //Same as above

//generating a custom id
// var obj = new ObjectID();
// console.log(obj);
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) =>{
    if(error){
        return console.log("Unable To Connect To MongoDB server");
    }
    console.log("Connected to MongoDB server");

    // db.collection('Todos').insertOne({
    //     text: 'Some text',
    //     completed: false
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert todo: ', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: "Ruqia",
    //     age: 21,
    //     location: "Islamabad"
    // }, (error, result) => {
    //     if(error){
    //         return console.log('Unable to insert user: ', error);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined,2));
    // });

    db.close();
});