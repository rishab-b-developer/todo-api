const {
    ObjectID
} = require('mongodb');
var express = require('express');
var body_parser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');


const serverPort = process.env.PORT || 3000;

var app = express();
app.use(body_parser.json()); // for parsing application/json

app.listen(serverPort, () => {
    console.log(`Server started listening on port ${serverPort}.`);
});

var handleInvalidInputError = (error, response) => {
    response.status(400).send(error);
};

var handleDataNotFoundError = (error, response) => {
    response.status(404).send(error);
};

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });
    todo.save()
        .then((doc) => {
            response.send(doc);
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

module.exports = {
    app
}