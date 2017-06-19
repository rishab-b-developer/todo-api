const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server: \n', JSON.stringify(err, undefined, 4));
    }
    console.log('Connected to MongoDB Server. \n');
    /*db.collection('Todos').insertOne({
        text: 'Test todo',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert todo: ', err);
        }
        console.log('Document inserted into todo: ', result);
    })*/
    /*db.collection('Users').insertOne({
        name: 'Rishab Bokaria',
        age: 27,
        location: 'Mumbai'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert into Users: \n', JSON.stringify(err, undefined, 4));
        }
        console.log('Document inserted into Users: \n', JSON.stringify(result.ops, undefined, 4));
        console.log(result.ops[0]._id.getTimestamp());
    })*/

    db.close();
});