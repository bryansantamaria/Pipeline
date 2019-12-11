const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.insert({
        "email": req.body.email,
        "password": req.body.password,
        "alias": req.body.username
    }, (err, user_in_db) => {
        if (err) throw err;
        res.send(JSON.stringify(user_in_db));
    });
});

var saltRounds = 10;
let hashedPassword = req.body.password;
bcrypt.hash(hashedPassword, saltRounds, (err, hash) => {
    if(err) throw err;
        console.log(hash);
});
bcrypt.compare(req.body.password, hashedPassword, (err, res) => {
    if(err) throw err;
    console.log('Password correct: ', res);
});

module.exports = router;
