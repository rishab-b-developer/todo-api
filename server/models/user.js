var mongoose = require('mongoose');


var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true,
        validate: {
            validator: function(v) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(v);
            },
            message: '{VALUE} is not a valid email'
        },
    },
    name: {
        type: String,
        minlength: 3,
        trim: true
    }
});

module.exports = {
    User
};