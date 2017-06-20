const {
    ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');

const {
    Todo
} = require('./../../models/todo');
const {
    User
} = require('./../../models/user');

const secret = '$#@*SHA-256*@#$';

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const access = 'auth';

const testUsers = [{
    _id: userOneId,
    email: 'rishab.bokaria@in.com',
    name: 'Rishab Bokaria',
    password: 'asdf1234',
    tokens: [{
        access,
        token: jwt.sign({
            _id: userOneId.toHexString(),
            access
        }, secret).toString()
    }]
}, {
    _id: userTwoId,
    email: 'rishika.jain@in.com',
    name: 'Rishika Jain',
    password: '4321fdsa',
    tokens: [{
        access,
        token: jwt.sign({
            _id: userTwoId.toHexString(),
            access
        }, secret).toString()
    }]
}];

const testTodos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 1234567890,
    _creator: userTwoId
}];

const testPopulateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(testUsers[0]).save();
            var userTwo = new User(testUsers[1]).save();

            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

const testPopulateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(testTodos);
        })
        .then(() => done());
};

module.exports = {
    testUsers,
    testTodos,
    testPopulateUsers,
    testPopulateTodos
};