var {
    User
} = require('./../models/user');


var handleAuthFailedError = (error, response) => {
    response.status(401)
        .send({
            'error': error
        });
};

var authenticate = (request, response, next) => {
    var token = request.header('x-auth');
    User.findByToken(token)
        .then((user) => {
            if (user) {
                request.token = token;
                request.user = user;
                next();
            } else {
                handleAuthFailedError("No user found with this token", response);
            }
        })
        .catch((error) => handleAuthFailedError(error, response));
};

module.exports = {
    authenticate
};