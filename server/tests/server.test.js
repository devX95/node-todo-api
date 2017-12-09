const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require("./../server");
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

expect.extend({
	toBeType(received, argument) {
		const initialType = typeof received;
		const type = initialType === "object" ? Array.isArray(received) ? "array" : initialType : initialType;
		return type === argument ? {
			message: () => `expected ${received} to be type ${argument}`,
			pass: true
		} : {
			message: () => `expected ${received} to be type ${argument}`,
			pass: false
		};
	}
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = "Text todo test";
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200)
        .expect((res)=> {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(3);
                expect(todos[2].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not ceate todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });

});

describe('GET /todos', ()=>{
    it("should get all todos", (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it("should get return todo doc", (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it("should not return todo doc creaated by other user", (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it("should return 404 if todo not found", (done) => {
        var id = new ObjectID();
        request(app)
        .get(`/todos/${id.toHexString}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it("should return 404 for none object ids", (done) => {
        request(app)
        .get(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not remove a todo by other', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID();
        request(app)
        .delete(`/todos/${id.toHexString}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid id', (done) => {
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id.toHexString();
        var body = {
            text: "Updated",
            completed: true
        };
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .send(body)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(body.text);
            expect(response.body.todo.completed).toBeTruthy();
            expect(response.body.todo.completedAt).toBeType("number");
        })
        .end(done);
    });

    it('should not update the todo by others', (done) => {
        var id = todos[0]._id.toHexString();
        var body = {
            text: "Updated",
            completed: true
        };
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(body)
        .expect(404)
        .end(done);
    });

    it("should clear completedAt when todo is not completed", (done) => {
        var id = todos[1]._id.toHexString();
        var body = {
            text: "Updated",
            completed: false
        };
        request(app)
        .patch(`/todos/${id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(body)
        .expect(200)
        .expect((response) => {
            expect(response.body.todo.text).toBe(body.text);
            expect(response.body.todo.completed).toBeFalsy();
            expect(response.body.todo.completedAt).toBeFalsy();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((response) => {
            expect(response.body).toEqual({});
        })
        .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '1234567';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((response) => {
            expect(response.headers['x-auth']).toBeTruthy();
            expect(response.body._id).toBeTruthy();
            expect(response.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }

            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = "asjdk";
        var password = "sda";

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
        var email = "gibrangul@hotmail.com";
        var password = "one pass";

        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });

});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((response) => {
            expect(response.headers['x-auth']).toBeTruthy();
        })
        .end((err, response) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                var tokens = user.tokens[1];
                expect(tokens).toHaveProperty('access', 'auth');
                expect(tokens).toHaveProperty('token', response.headers['x-auth']);
                done();
            }).catch((e) => done(e));
        })
    });
    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: 'invalid password'
        })
        .expect(400)
        .expect((response) => {
            expect(response.headers['x-auth']).toBeFalsy();
        })
        .end((err, response) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, resonse) => {
            if(err){
                return done(err);
            }

            User.findById(users[0]._id).then((user) => {
                expect(user.tokens.length).toEqual(0);
                done();
            }).catch((e) => done(e));
        });
    });
});