const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/', (req, res) => {
    request('http://127.0.0.1:3000/chat', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(chatObject => {
      //console.log(JSON.parse(chatObject));
      let parsedObject = JSON.parse(chatObject);
      console.log(parsedObject);
        res.cookie('user', `${req.session.user._id}`, { maxAge: 3600, httpOnly: false });
        res.render('chat', { "users": parsedObject.users, "chatrooms": parsedObject.chatrooms });
    });
});

module.exports = router;
