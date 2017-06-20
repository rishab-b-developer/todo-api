const { SHA256 } = require("crypto-js");
const jwt = require('jsonwebtoken');

/*var msg = "I\'m user no 3";
var hashMsg = SHA256(msg).toString();

console.log(`Message: ${msg}\nHash: ${hashMsg}`);*/

var data = {
    id: 20
};
const secret = '$#@-256!';

var token = jwt.sign(data, secret);
console.log(token);

var decoded = jwt.verify(token, secret);
console.log(decoded);