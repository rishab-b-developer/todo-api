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



const testTodos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo'
}];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(testTodos);
        })
        .then(() => done());
});

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
})

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
})

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
})