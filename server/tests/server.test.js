const expect = require('expect');
const request = require('supertest')
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');
const {
    User
} = require('./../models/user');
const {
    testUsers,
    testTodos,
    testPopulateUsers,
    testPopulateTodos
} = require('./seed/seed');

beforeEach(testPopulateUsers);
beforeEach(testPopulateTodos);

describe('POST/todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app).post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(3);
                        expect(todos[2].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should not create a new todo with invalid body', (done) => {
        request(app).post('/todos')
            .send({
                text: ''
            })
            .expect(400)
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((err) => done(err));
            });
    });
});

describe('GET/todos', () => {
    it('should return all todos', (done) => {
        request(app).get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET/todos/:id', () => {
    it('should return a todo', (done) => {
        var id = testTodos[0]._id.toHexString();
        request(app).get(`/todos/${id}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(testTodos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app).get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if invalid todo id', (done) => {
        request(app).get('/todos/123')
            .expect(400)
            .end(done);
    });
});

describe('DELETE/todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = testTodos[1]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(testTodos[1].text);
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if invalid todo id', (done) => {
        request(app).delete('/todos/123')
            .expect(400)
            .end(done);
    });
});

describe('PATCH/todos/:id', () => {
    it('should update a todo', (done) => {
        var id = testTodos[0]._id.toHexString();
        var body = {
            text: 'Test first todo',
            completed: true
        };

        request(app).patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo).toExist();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toExist();
                        expect(todo.text).toBe(body.text);
                        expect(todo.completed).toBe(true);
                        expect(todo.completedAt).toBeA('number')
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should clear completedAt in todo if completed is false', (done) => {
        var id = testTodos[1]._id.toHexString();
        var body = {
            text: 'Test second todo',
            completed: false
        };

        request(app).patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo).toExist();
            })
            .end((error, response) => {
                if (error) {
                    return done(error);
                }

                Todo.findById(id)
                    .then((todo) => {
                        expect(todo).toExist();
                        expect(todo.text).toBe(body.text);
                        expect(todo.completed).toBe(false);
                        expect(todo.completedAt).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID().toHexString();
        request(app).patch(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if invalid todo id', (done) => {
        request(app).patch('/todos/123')
            .expect(400)
            .end(done);
    });
});

describe('GET/users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app).get('/users/me')
            .set('x-auth', testUsers[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body._id).toBe(testUsers[0]._id.toHexString());
                expect(response.body.email).toBe(testUsers[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app).get('/users/me')
            .expect(401)
            .expect((response) => {
                expect(response.body.error).toExist();
            })
            .end(done);
    });

});

describe('POST/users', () => {
    it('should create a user', (done) => {
        var email = 'rishab.bokaria@ril.com';
        var password = 'fdsa4321';
        var name = 'Rishab Bokaria';

        request(app).post('/users')
            .send({
                email,
                password,
                name
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
                expect(response.body.name).toBe(name);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));

            });
    });

    it('should not create a user if email already in use', (done) => {
        var email = testUsers[0].email;
        var password = 'fdsa4321';
        var name = 'Rishab Bokaria';

        request(app).post('/users')
            .send({
                email,
                password,
                name
            })
            .expect(400)
            .expect((response) => {
                expect(response.body.code).toBe(11000);
            })
            .end(done);
    });

    it('should return validation errors if incorrect data', (done) => {
        var email = 'rishab-sis.com';
        var password = 'pass231';
        var name = '';

        request(app).post('/users')
            .send({
                email,
                password,
                name
            })
            .expect(400)
            .expect((response) => {
                expect(response.body.errors.email).toExist();
                expect(response.body.errors.password).toExist();
                expect(response.body.errors.name).toExist();
            })
            .end(done);
    });
});

describe('POST/users/login', () => {
    it('should login user and return auth token', (done) => {
        var email = testUsers[1].email;
        var password = testUsers[1].password;
        request(app).post('/users/login')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((response) => {
                expect(response.headers['x-auth']).toExist();
                expect(response.body._id).toExist();
                expect(response.body.email).toBe(email);
                expect(response.body.name).toExist();
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                User.findById(testUsers[1]._id)
                    .then((user) => {
                        expect(user.tokens[0]).toInclude({
                            access: 'auth',
                            token: response.headers['x-auth']
                        });
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        var email = testUsers[1].email;
        var password = '0000000';

        request(app).post('/users/login')
            .send({
                email,
                password
            })
            .expect(400)
            .expect((response) => {
                expect(response.headers['x-auth']).toNotExist();
                expect(response.body.error).toExist();
            })
            .end((err, response) => {
                if (err) {
                    return done(err);
                }
                User.findById(testUsers[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));
            });
    });

});