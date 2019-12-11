const express = require('express');
const router = express.Router();

router.get('/user/:username', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("users");
  console.log(req.params.username)
  collection.find({"alias" : new RegExp(req.params.username, 'i')}, {})
    .then(users => {
      console.log(JSON.stringify(users));
      if (users) {
        res.send(JSON.stringify(users));
      } else {
        res.send(false);
      }
    });
});

module.exports = router;