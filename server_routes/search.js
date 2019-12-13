const express = require('express');
const router = express.Router();

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

module.exports = router;