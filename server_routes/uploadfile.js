const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log(req.body);
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.insert({
        "picturePath": req.body.path,
    }, (err, picture_in_db) => {
        if (err) throw err;
        res.send(picture_in_db);
    });
});

module.exports = router;