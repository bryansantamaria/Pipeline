const express = require('express');
// const fileUpload = require('express-fileupload');
const router = express.Router();

router.post('/', async (req, res) => {
    var pipelineDB = req.db;
    var collection = pipelineDB.get("users");
    collection.insert({
        "profilePicture": req.files.profile_pic,
    }, (err, picture_in_db) => {
        if (err) throw err;
        res.send(picture_in_db);
    });
});

module.exports = router;