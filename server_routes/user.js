const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => {
    var userDB = req.db;
    var collection = userDB.get("users");
    console.log(req.params.id)
    collection.find({ "_id": req.params.id }, {})
        .then(user => {
            console.log(JSON.stringify(user[0]));
            if (user) {
                res.send(JSON.stringify(user[0]));
            } else {
                res.send(false);
            }
        });
})


module.exports = router;