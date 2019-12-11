const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.find({ $or: [{ "alias": req.body.username}, { "email": req.body.username}] }, {}).then(user => {
        
        console.log('USER: '+user);
        bcrypt.compare(req.body.password, hashedPassword, (err, res) => {
            if (err) throw err;
            console.log('Password correct: ', res);
        });
        if (user[0]) {
            if (user[0].password == req.body.password) {
                res.send(user[0]);
            } else {
                res.send(false);
            }
        } else {
            res.send(false);
        }
    });
});

module.exports = router;
