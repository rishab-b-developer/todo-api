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

const serverPort = process.env.PORT;

var app = express();
app.use(body_parser.json()); // for parsing application/json

app.listen(serverPort, () => {
    console.log(`Server started listening on port ${serverPort}.`);
});

var handleInvalidInputError = (error, response) => {
    response.status(400)
        .send(error);
};

var handleDataNotFoundError = (error, response) => {
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
        .catch((err) => handleInvalidInputError(err, response));
});

app.post('/todos', (request, response) => {
    var body = _.pick(request.body, ['text']);
    var todo = new Todo(body);
    todo.save()
        .then((todo) => {
            response.send(todo);
        }, (err) => handleInvalidInputError(err, response));
});

app.get('/todos', (request, response) => {
    Todo.find()
        .then((todos) => {
            response.send({
                todos
            });
        }, (err) => handleDataNotFoundError(err, response));
});

app.get('/todos/:id', (request, response) => {
    var id = request.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findById(id)
            .then((todo) => {
                if (todo) {
                    response.send({
                        todo
                    });
                } else {
                    handleDataNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => handleDataNotFoundError(err, response));
    } else {
        handleInvalidInputError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

app.delete('/todos/:id', (request, response) => {
    var id = request.params.id;
    if (ObjectID.isValid(id)) {
        Todo.findByIdAndRemove(id)
            .then((todo) => {
                if (todo) {
                    response.send({
                        todo
                    });
                } else {
                    handleDataNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => handleDataNotFoundError(err, response));
    } else {
        handleInvalidInputError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    var body = _.pick(request.body, ['text', 'completed']);

    if (ObjectID.isValid(id)) {
        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {
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
                    handleDataNotFoundError({
                        message: "Id not found",
                        name: "Todo not found"
                    }, response);
                }
            }, (err) => handleDataNotFoundError(err, response));
    } else {
        handleInvalidInputError({
            message: "Invalid id",
            name: "CastError"
        }, response);
    }
});

module.exports = {
    app
}