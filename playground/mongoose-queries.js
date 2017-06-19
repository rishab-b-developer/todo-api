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

const id = '5947a68e0ebd6208264f8347';

if (!ObjectID.isValid(id)) {
    console.log('Id is not valid');
} else {
    User.find()
        .then((users) => {
            console.log(`Users: \n${users}`);
        })
        .catch((err) => {
            console.log(err);
        });

    User.findById(id)
        .then((user) => {
            if (user) {
                console.log(`User: \n${user}`);
            } else {
                console.log('user not found');
            }
        })
        .catch((err) => {
            console.log(err);
        });
}