var express = require('express');
var body_parser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose')
var {
    Todo
} = require('./models/todo')
var {
    User
} = require('./models/user')


const serverPort = process.env.PORT || 3000;

var app = express();
app.use(body_parser.json()); // for parsing application/json

app.listen(serverPort, () => {
    console.log(`Server started listening on port ${serverPort}.`);
});

var handleError = (error, response) => {
    response.status(400).send(error);
};

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });
    todo.save()
        .then((doc) => {
            response.send(doc);
        }, (err) => handleError(err, response));
});

app.get('/todos', (request, response) => {
    Todo.find()
        .then((todos) => {
            response.send({
                todos
            });
        }, (err) => handleError(err, response));
});

module.exports = {
    app
}