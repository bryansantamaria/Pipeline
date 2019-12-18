const express = require('express');
const router = express.Router();

router.get('/user/:query', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("users");
  collection.find({"alias" : new RegExp(req.params.query, 'i')}, {} )
    .then(users => {
      if (users) {
        res.send(JSON.stringify(users.map(user => user = {alias: user.alias, _id: user._id})));
      } else {
        res.send(false);
      }
    });
});

router.get('/emoji/:category', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("emojis");
  collection.find({"category" : req.params.category}, {} )
    .then(emojis => {
      if (emojis) {
        res.send(JSON.stringify(emojis));
      } else {
        res.send(false);
      }
    });
});

module.exports = router;
