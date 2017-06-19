const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB Server: \n', JSON.stringify(err, undefined, 4));
    }
    console.log('Connected to MongoDB Server. \n');
    /*db.collection('Todos')
        .deleteMany({
            text: 'Plan your next travel'
        })
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to delete document: ', err);
        });*/
    /*db.collection('Todos')
        .findOneAndDelete({ completed: false })
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to delete document: ', err);
        });*/
    /* db.collection('Users')
         .deleteMany({ name: 'Rishab Bokaria' })
         .then((result) => {
             console.log(result);
         }, (err) => {
             console.log('Unable to delete document: ', err);
         });*/
    db.collection('Users')
        .findOneAndDelete({ _id: new ObjectID('594774edad3fdb06e9d72936') })
        .then((result) => {
            console.log(result);
        }, (err) => {
            console.log('Unable to delete document: ', err);
        });
    db.close();
});