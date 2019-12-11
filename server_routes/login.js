const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.find({ $or: [{ "alias": req.body.username}, { "email": req.body.username}] }, {}).then(user => {
        console.log('USER: '+user);
        if (user[0]) {
            bcrypt.compare(req.body.password, user[0].password, (err, authorized) => {
                if (err) throw err;
                if (authorized) {
                    let userobject = {
                        'alias': user[0].alias,
                        '_id': user[0]._id 
                    }
                    res.send(userobject);
                } else {
                    res.send(false);
                }
                console.log('Password correct: ', authorized);
            });
            
        } else {
            res.send(false);
        }
    });
});

module.exports = router;
