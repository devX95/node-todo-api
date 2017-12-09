require('./config/config.js');

const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require("./db/mongoose");
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;
var app = express();

app.use(bodyParser.json());

app.post("/todos", (request, response)=> {
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc) => {
        response.send(doc);
    }, (error)=> {
        response.status(400).send(error);
    });
});

app.get("/todos", (request, response) => {
    Todo.find().then((todos) => {
        response.send({
            todos
        });
    }, (error) => {
        res.status(400).send(error);
    });
});

//GET /todos/id

app.get('/todos/:id', (request, response) => {
    var id = request.params.id;
    if (!ObjectID.isValid(id)){
        response.status(404).send();
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((e) => response.status(404).send());
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;
    if(!ObjectID.isValid(id)){
        response.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return response.status(404).send();
        }
        response.send({todo});
    }).catch((e) => response.status(400).send(e));
});

app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return response.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if(!todo) {
            return response.status(404).send(); 
        }
        response.send({todo});

    }).catch((e) => {
        response.status(404).send();
    });
});

// POST /users
app.post('/users', (request, response) => {
    var body = _.pick(request.body, ["email", "password"]);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        response.header('x-auth', token).send(user);
    }).catch((e) => response.status(400).send(e));
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/users/login/', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            response.header('x-auth', token).send(user);
        });
    }).catch((e) => response.status(400).send(e));
});

app.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

module.exports = {app};