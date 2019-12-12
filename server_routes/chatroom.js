const express = require('express');
const router = express.Router();

router.put('/', (req, res) => {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  console.log('Recieved message from app >');
  console.log(req.body);
  collection.insert({ //Inserts message to DB
    'alias': req.body.alias,
    'message': req.body.message,
    'timestamp': req.body.timestamp,
    'attachments': [
      {
        'url': 'localhost:27017/attachments',
        'filename': 'test.jpg'
      }
    ]
  }, (err, message_in_db) => { //Gets message back from database
    if (err) throw err;
    console.log('Inserted message in DB >');
    console.log(message_in_db);
    res.json(JSON.stringify(message_in_db)); //Returns message to app.js
  });
});

/* POST Update user. */
router.put('/edit', function (req, res) {
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');
  console.log('\n');
  console.log('Server spits out: ');
  console.log(req.body);
  collection.update({ '_id': req.body._id }, {
    $set: {
      'alias': req.body.alias,
      'content': req.body.message,
      'datetime': req.body.timestamp
    }
  }, (err) => {
    if (err) throw err;
    collection.find({ '_id': req.body._id }, function (err, edit_msg_db) {
      console.log('edit message in db >')
      console.log(edit_msg_db[0]);
      if (err) throw err;
      res.json(JSON.stringify(edit_msg_db[0]));
    });
  });
});

/* GET delete user. */
router.delete('/', function (req, res) {
  console.log('\n');
  console.log('message to be deleted >')
  console.log(req.body);
  var pipelineDB = req.db;
  var collection = pipelineDB.get('chatrooms');

  collection.remove({ '_id': req.body._id }, { 'justOne': true }, (err, delete_status) => {
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


//GET specific chatroom.
router.get('/:_id', (req, res) => {
  let pipelineDB = req.db;
  var chatroomCollection = pipelineDB.get("chatrooms");
  chatroomCollection.find({_id: req.params._id}, (err, chatrooms) => {
    if (err) throw err;
    res.json(chatrooms);
  });
});

module.exports = router;
