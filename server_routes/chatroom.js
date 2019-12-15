const express = require('express');
const router = express.Router();
const mongo = require('mongodb');

router.put('/', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  let _id = new mongo.ObjectId();
  console.log('Recieved message from app >');
  console.log(req.body);
  console.log('Recieved message from app >');
  console.log(_id);
  collection.update({
      _id: req.body.chatroom
    },
    //Inserts message to specific chatroom message array.
    {
      $push: {
        messages: {
          _id: _id,
          alias: req.body.alias,
          message: req.body.message,
          avatar: req.body.avatar,
          timestamp: req.body.timestamp,
          mentions: req.body.mentions
        }
      }
    }, (err, message_in_db) => { //Gets message back from database
      if (err) throw err;
      console.log('Inserted message in DB >');
      console.log(message_in_db);
      collection.find({'_id': req.body.chatroom}, (err, chatroom) => {
        console.log(chatroom);
        message_in_db = chatroom[0].messages.find(message => message._id = _id);
        res.json(JSON.stringify(message_in_db)); //Returns message to app.js
      });
    });
});

/* POST Update user. */
router.put('/edit', function(req, res) {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  console.log('\n');
  console.log('Server spits out: ');
  console.log(req.body);
  collection.update({
    '_id': req.body._id
  }, {
    $set: {
      'alias': req.body.alias,
      'content': req.body.message,
      'avatar': req.body.avatar,
      'timestamp': req.body.timestamp,
      'mentions': req.body.mentions
    }
  }, (err) => {
    if (err) throw err;
    collection.find({
      '_id': req.body._id
    }, function(err, edit_msg_db) {
      console.log('edit message in db >')
      console.log(edit_msg_db[0]);
      if (err) throw err;
      res.json(JSON.stringify(edit_msg_db[0]));
    });
  });
});

/* GET delete user. */
router.delete('/', function(req, res) {
  console.log('\n');
  console.log('message to be deleted >')
  console.log(req.body);
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');

  collection.remove({
    '_id': req.body._id
  }, {
    'justOne': true
  }, (err, delete_status) => {
    if (err) throw err;
    res.json(JSON.stringify(req.body));
    console.log(delete_status.result);
  });
});

//GET all chatrooms.
router.get('/', (req, res) => {
  let pipelineDB = req.db;
  var chatroomCollection = pipelineDB.get("chatrooms");
  chatroomCollection.find({}, (err, chatrooms) => {
    if (err) throw err;
    res.json(chatrooms);
  });
});

//POST new chatroom with given id.
router.post("/", (req, res) => {
  let pipelineDB = req.db;
  let chatroomCollection = pipelineDB.get("chatrooms");
  chatroomCollection.insert({
    "members": req.body,
    'type': 'privateMessage',
    'messages': []
  }, (err, newChatroom) => {
    if (err) throw err;
    res.json(JSON.stringify(newChatroom));
  });
});

//GET specific chatroom.
router.get('/:_id', (req, res) => {
  let pipelineDB = req.db;
  var chatroomCollection = pipelineDB.get("chatrooms");
  chatroomCollection.find({
    _id: req.params._id
  }, (err, chatrooms) => {
    if (err) throw err;
    res.json(chatrooms);
  });
});

module.exports = router;
