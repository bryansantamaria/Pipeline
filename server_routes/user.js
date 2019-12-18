const express = require('express');
const router = express.Router();

//GET user with specific ID
router.get('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    console.log(req.params.id)
    collection.findOne({ "_id": req.params.id }, {})
        .then(user => {
            console.log(JSON.stringify(user));
            if (user) {
                let strippedUser = {alias: user.alias, _id: user._id, avatar: user.avatar, email: user.email};
                res.send(JSON.stringify(strippedUser));
            } else {
                res.send(false);
            }
        });
})

//PUT user with specific ID
router.put('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    console.log('req.body SPITS OUT >');
    console.log(req.body);
    collection.update({ "_id": req.params.id }, {
        $set: {
            'alias': req.body.alias,
            'email': req.body.email
        }
    }).then(user => {
        console.log(JSON.stringify(user[0]));
        if (user) {
            res.send(JSON.stringify(user[0]));
        } else {
            res.send(false);
        }
    });
})


module.exports = router;
