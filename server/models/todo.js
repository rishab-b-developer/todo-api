const mongoose = require('mongoose');
const _ = require('lodash');

var TodoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

TodoSchema.methods.toJSON = function() {
    var todo = this;
    var todoObj = todo.toObject();
    var keys = todo.completed?['text', 'completed', '_id', 'completedAt']:['text', 'completed', '_id'];
    return _.pick(todoObj, keys);
}

var Todo = mongoose.model('Todo', TodoSchema);

module.exports = {
    Todo
};