const express = require('express');
const router = express.Router();

//Moved to server.js
router.post('/', (req, res) => {
    var msgDB = req.db;
    var collection = msgDB.get('messages');
    console.log(req.body);
    collection.insert({ //Inserts message to DB
        'alias': req.body.content.alias,
        'content': req.body.content.message,
        'datetime': req.body.content.date,
        'attachments': [
            {
                'url': 'localhost:27017/attachments',
                'filename': 'test.jpg'
            }
        ]
    }, (err, message_in_db) => { //Gets message back from database
        if (err) throw err;
        console.log(message_in_db);
        res.json(JSON.stringify(message_in_db)); //Returns message to app.js
    });
});

/* POST Update user. */
router.put('/', function (req, res) {
    var msgDB = req.db;
    var collection = msgDB.get('messages');

    collection.update({ '_id': req.body._id }, {
        $set: {
            'alias': req.body.content.alias,
            'content': req.body.content.message,
            'datetime': req.body.content.date
        }
    }, (err, edit_msg_db) => {
        if (err) throw err;
        res.json(JSON.stringify(edit_msg_db));
    });
});
//not sure if correctly done.
router.get('/:chatroom', (req, res) => {
    let pipelineDB = req.db;
    var chatroomCollection = pipelineDB.get("chatrooms");
    chatroomCollection.find({"name": req.params.chatroom }, {}, function (err, chatroom) {
      if (err) {
        //Needs to send server an error instead of an empty array.
        throw err;
        res.send("The chatroom you requested isn¨t available, please join one that exist." + err);
      }
      else {
        res.json(chatroom);
      }
    });
});

module.exports = router;
