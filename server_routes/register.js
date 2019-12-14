const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/', (req, res) => {
    var pipelineDB = req.db;
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) throw err;
    
        var collection = pipelineDB.get("users");
        collection.insert({
            "email": req.body.email,
            "password": hashedPassword,
            "alias": req.body.username
        }, (err, user_in_db) => {
            if (err) throw err;
            collection.update({'_id': user_in_db._id}, {
                $set: {
                    'avatar': '/images/' + user_in_db._id + '.jpg'
                }
            })
            res.send(JSON.stringify(user_in_db));
        });
    });
});

module.exports = router;
