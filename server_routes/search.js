const express = require('express');
const router = express.Router();

//GET user query
router.get('/user/:query', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("users");
  console.log(req.params.query)
  collection.find({"alias" : new RegExp(req.params.query, 'i')}, {} )
    .then(users => {
      console.log(JSON.stringify(users));
      if (users) {
        console.log('Search result >');
        console.log(users);

        res.send(JSON.stringify(users.map(user => user = {alias: user.alias, _id: user._id})));
      } else {
        res.send(false);
      }
    });
});

//GET certain emoji category
router.get('/emoji/:category', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("emojis");
  console.log(req.params.category)
  collection.find({"category" : req.params.category}, {} )
    .then(emojis => {
      console.log(JSON.stringify(emojis));
      if (emojis) {
        console.log('Search result >');
        console.log(emojis);

        res.send(JSON.stringify(emojis));
      } else {
        res.send(false);
      }
    });
});

module.exports = router;
