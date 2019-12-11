const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// router.post('/', (req, res) => {
//     var pipelineDB = req.db;
//     var collection = pipelineDB.get("users");
//     collection.insert({
//         "email": req.body.email,
//         "password": req.body.password,
//         "alias": req.body.username
//     }, (err, user_in_db) => {
//         if (err) throw err;
//         res.send(JSON.stringify(user_in_db));
//     });
// });
router.post('/', (req, res) => {
    var pipelineDB = req.db;

    var saltRounds = 10;
    let password = req.body.password;
    console.log('password: '+password);

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) throw err;
        console.log('hashedPassword: '+hashedPassword);
        var collection = pipelineDB.get("users");
        collection.insert({
            "email": req.body.email,
            "password": hashedPassword,
            "alias": req.body.username
        }, (err, user_in_db) => {
            if (err) throw err;
            res.send(JSON.stringify(user_in_db));
        });
    });
    bcrypt.compare(req.body.password, password, (err, res) => {
        if (err) throw err;
        console.log('Password correct: ', res);
    });

});



module.exports = router;
