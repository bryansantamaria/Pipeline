const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    var userDB = req.db;
    var collection = userDB.get("users");
    collection.find({ "alias": req.body.username }, {}).then(user => {
        console.log(user);
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