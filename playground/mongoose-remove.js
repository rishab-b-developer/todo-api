const {
    ObjectID
} = require('mongodb');


var {
    mongoose
} = require('./../server/db/mongoose');

var {
    Todo
} = require('./../server/models/todo');

var {
    User
} = require('./../server/models/user');


/*Todo.remove({})
    .then((result) => {
        console.log(`Result: \n${result}`);
    })
    .catch((err) => {
        console.log(err);
    });*/

const id = '5947deebbd06af4e4f755843';

if (!ObjectID.isValid(id)) {
    console.log('Id is not valid');
} else {
    Todo.findOneAndRemove({
            _id: id
        })
        .then((result) => {
            console.log(`Result: \n${result}`);
        })
        .catch((err) => {
            console.log(err);
        });
}