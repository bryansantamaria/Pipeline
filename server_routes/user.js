const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.find({ "_id": req.params.id }, {})
        .then(user => {
            if (user) {
                let strippedUser = user.map(user => user = {alias: user.alias, _id: user._id, avatar: user.avatar, email: user.email});
                res.send(JSON.stringify(strippedUser[0]));
            } else {
                res.send(false);
            }
        });
})

router.put('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.update({ "_id": req.params.id }, {
        $set: {
            'alias': req.body.alias,
            'email': req.body.email
        }
    }).then(user => {
        if (user) {
            res.send(JSON.stringify(user[0]));
        } else {
            res.send(false);
        }
    });
})


module.exports = router;
