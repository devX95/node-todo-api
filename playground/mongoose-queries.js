const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var uID = "5a2644d7f3b1968dc0e83604";

if(!ObjectID.isValid(uID)){
    console.log("Invalid user ID");
} else {
    User.findById(uID).then((user) => {
        if(!user) {
            return console.log('User not found');
        }
        console.log(JSON.stringify(user, undefined, 2));
    }).catch((e) => console.log(e));
}

// var id = "5a26847c7caa5da55ab129e1";
// if(!ObjectID.isValid(id)){
//     console.log('The id is invalid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo by id: ', todo);
// }).catch((e) => console.log(e));

