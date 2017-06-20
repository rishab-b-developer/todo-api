require('./config/config');

const {
    ObjectID
} = require('mongodb');
const _ = require('lodash');
const express = require('express');
const body_parser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');
var {
    authenticate
} = require('./middleware/authenticate');


const serverPort = process.env.PORT;

var app = express();
app.use(body_parser.json()); // for parsing application/json

app.listen(serverPort, () => {
    console.log(`Server started listening on port ${serverPort}.`);
});

var sendBadReuestError = (error, response) => {
    response.status(400)
        .send(error);
};

var sendFileNotFoundError = (error, response) => {
    response.status(404)
        .send(error);
};

app.post('/users', (request, response) => {
    var body = _.pick(request.body, ['email', 'password', 'name']);
    var user = new User(body);
    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            response.header('x-auth', token)
                .send(user);
        })
        .catch((err) => sendBadReuestError(err, response));
});

app.post('/users/login', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateAuthToken().then((token) => {
                response.header('x-auth', token)
                    .send(user);
            });
        })
        .catch((err) => sendBadReuestError(err, response));
});

app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token)
        .then(() => {
            response.status(200)
                .send();
        }, () => {
            sendBadReuestError({}, response);
        });
});

app.get('/users/me', authenticate, (request, response) => {
    response.send(request.user);
});

app.post('/todos', authenticate, (request, response) => {
    var body = _.pick(request.body, ['text']);
    body._creator = request.user._id;
    var todo = new Todo(body);
    todo.save()
        .then((todo) => {
            response.send(todo);
        }, (err) => sendBadReuestError(err, response));
});

app.get('/todos', authenticate, (request, response) => {
    Todo.find({
            _creator: request.user._id
        })
        .then((todos) => {
            response.send({
                todos
            });
        }, (err) => sendFileNotFoundError(err, response));
});

app.get('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findOne({
                _id: id,
                _creator: request.user._id
            })
            .then((todo) => {
                if (todo) {
                    response.send({
                        todo
                    });
                } else {
                    sendFileNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => sendFileNotFoundError(err, response));
    } else {
        sendBadReuestError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

app.delete('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findOneAndRemove({
                _id: id,
                _creator: request.user._id
            })
            .then((todo) => {
                if (todo) {
                    response.send({
                        todo
                    });
                } else {
                    sendFileNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => sendFileNotFoundError(err, response));
    } else {
        sendBadReuestError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

app.patch('/todos/:id', authenticate, (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);

    if (ObjectID.isValid(id)) {
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findOneAndUpdate({
                _id: id,
                _creator: request.user._id
            }, {
                $set: body
            }, {
                new: true
            })
            .then((todo) => {
                if (todo) {
                    response.send({
                        todo
                    });
                } else {
                    sendFileNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => sendFileNotFoundError(err, response));
    } else {
        sendBadReuestError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

module.exports = {
    app
}