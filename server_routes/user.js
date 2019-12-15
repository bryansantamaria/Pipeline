const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    console.log(req.params.id)
    collection.find({ "_id": req.params.id }, {})
        .then(user => {
            console.log(JSON.stringify(user[0]));
            if (user) {
                let strippedUser = user.map(user => user = {alias: user.alias, _id: user._id, avatar: user.avatar});
                res.send(JSON.stringify(strippedUser[0]));
            } else {
                res.send(false);
            }
        });
})

router.put('/:id', (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    console.log(req.params.id)
    collection.update({ "_id": req.params.id }, {
        $set: {
            'alias': req.body.alias,
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
