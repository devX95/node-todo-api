var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp");

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var newTodo = new Todo({
//     text: 'Cook Dinner',
//     completed: false
// });

var secondTodo = new Todo({
    text: 'Party Tomorrow',
    completed: true,
    completedAt: new Date().getFullYear()
});

secondTodo.save().then((result) => {
    console.log("Saved Todo: ", result);
}, (error) => {
    console.log("Unable to save todo");
});