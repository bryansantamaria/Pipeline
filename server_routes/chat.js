const express = require('express');
const router = express.Router();

//GET Chatrooms & Users
router.get('/', async (req, res) => {
    let usersArray = [];
    let chatroomsArray = [];
    var pipelineDB = req.db;

    var collection = pipelineDB.get("users");
    usersArray = await collection.find().then(users => {
      return users;
    });
    let chatroomCollection = pipelineDB.get("chatrooms");
    chatroomsArray = await chatroomCollection.find().then(chatrooms => {
      return chatrooms;
    });
    console.log(usersArray);
    let chatObject = {
      users: usersArray,
      chatrooms: chatroomsArray
    };
    res.send(chatObject);
});

//GET User with specific ID
router.get('/:id', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("users");
  console.log(req.params.id)
  collection.find({
      "_id": req.params.id
    }, {})
    .then(user => {
      console.log(JSON.stringify(user[0]));
      if (user) {
        res.send(JSON.stringify(user[0]));
      } else {
        res.send(false);
      }
    });
})

//PUT Edit user with specific ID
router.put('/edit/:id', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get("users");
  console.log(req.params.id)
  collection.find({
      "_id": req.params.id
    }, {})
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
