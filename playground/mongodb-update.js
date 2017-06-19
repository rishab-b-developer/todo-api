const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server: \n', JSON.stringify(err, undefined, 4));
    }
    console.log('Connected to MongoDB Server. \n');
    db.collection('Users')
        .findOneAndUpdate({
            name: 'Rishab Bokaria'
        }, {
            $set: {
                name: 'Sunita Bokaria'
            },
            $inc: {
                age: 3
            }
        }, {
            returnOriginal: false
        })
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to delete document: ', err);
        });
    db.close();
});