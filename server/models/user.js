const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const secret = '$#@*SHA-256*@#$';

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 1,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
        trim: true
    },
    name: {
        type: String,
        minlength: 1,
        required: true,
        trim: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['email', 'name', '_id']);
}

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, secret).toString();

    user.tokens.push({
        access,
        token
    })

    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, secret);
    } catch (e) {
        return Promise.reject('Invalid auth token!');
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({ email })
        .then((user) => {
            if (!user) {
                return Promise.reject({ error: 'email not registered!' });
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, res) => {
                    if (!res) {
                        reject(err || { error: 'invalid password!' });
                    } else {
                        resolve(user);
                    }
                });
            });
        })
}

UserSchema.pre('save', function(next, done) {
    var user = this;
    if (user.isModified('password')) {
        var pwd = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(pwd, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};

/*validator: (value) => {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value);
            },*/