const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
var sanitizeHtml = require('sanitize-html');

router.put('/', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  let _id = new mongo.ObjectId();
  let chatroomID = req.body.chatroom;
  //console.log('\n\n');
  //console.log('Recieved message from app >');
  //console.log(req.body);
  collection.update({
    _id: chatroomID
  },
    //Inserts message to specific chatroom message array.
    {
      $push: {
        messages: {
          _id: _id,
          alias: req.body.alias,
          message: sanitizeHtml(req.body.message),
          avatar: req.body.avatar,
          timestamp: req.body.timestamp,
          mentions: req.body.mentions
        }
      }
    }, (err) => { //Gets message back from database
      if (err) throw err;
      collection.findOne(
        { _id: chatroomID },
        (err, chatroom) => {
          if (err) throw err;
          //console.log(chatroom);
          let message_in_db = chatroom.messages.find(message => message._id == _id.toString());
          res.json(JSON.stringify(message_in_db)); //Returns message to app.js
        });
    });
});

/* POST Update user. */
router.put('/edit', function (req, res) {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  //console.log('\n');
  //console.log('Server spits out: ');
  //console.log(req.body);
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
    }, function (err, edit_msg_db) {
      //console.log('edit message in db >')
      //console.log(edit_msg_db[0]);
      if (err) throw err;
      res.json(JSON.stringify(edit_msg_db[0]));
    });
  });
});

/* GET delete user. */
router.delete('/', function (req, res) {
  //console.log('\n');
  //console.log('message to be deleted >')
  //console.log(req.body);
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');

  collection.remove({
    '_id': req.body._id
  }, {
    'justOne': true
  }, (err, delete_status) => {
    if (err) throw err;
    res.json(JSON.stringify(req.body));
    //console.log(delete_status.result);
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
    res.json(newChatroom);
  });
});

router.post("/newChatroom", (req, res) => {
  let pipelineDB = req.db;
  let chatroomCollection = pipelineDB.get("chatrooms");
  chatroomCollection.insert({
    "name": req.body[1],
    "members": req.body[0],
    'type': 'publicChannel',
    'messages': []
  }, (err, newChatroom) => {
    if (err) throw err;
    res.json(newChatroom);
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
