const { SHA256 } = require("crypto-js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


var pwd = "123abc!";
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(pwd, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPwd = '$2a$10$QC8tQpwF5SN28HvcsOwbPulFO4456hhFl.suSW3Rbn1twVpEDjfYK';
bcrypt.compare(pwd, hashedPwd, (err, res) => {
    console.log(res);
});

/*var data = {
    id: 20
};
const secret = '$#@-256!';

var token = jwt.sign(data, secret);
console.log(token);

var decoded = jwt.verify(token, secret);
console.log(decoded);*/