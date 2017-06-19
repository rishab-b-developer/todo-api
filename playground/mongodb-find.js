const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server: \n', JSON.stringify(err, undefined, 4));
    }
    console.log('Connected to MongoDB Server. \n');
    /* db.collection('Todos')
         .find({
             _id: new ObjectID('59477358e6e62f0615a88227')
         })
         .toArray()
         .then((docs) => {
             console.log('Todos');
             console.log(JSON.stringify(docs, undefined, 4));
         }, (err) => {
             console.log('Unable to fetch documents:', JSON.stringify(err, undefined, 4));
         });*/
    db.collection('Users')
        .find({
            name: 'Rishab Bokaria'
        })
        .toArray()
        .then((docs) => {
            console.log('Users');
            console.log(JSON.stringify(docs, undefined, 4));
        }, (err) => {
            console.log('Unable to fetch documents:', JSON.stringify(err, undefined, 4));
        });
    db.close();
});