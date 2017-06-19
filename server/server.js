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

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });
    todo.save()
        .then((doc) => {
            response.send(doc);
        }, (err) => {
            response.status(400).send(err);
        });
})