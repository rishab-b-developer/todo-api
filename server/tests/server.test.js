const expect = require('expect');
const request = require('supertest')

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
    text: 'First test todo'
}, {
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
    })
})