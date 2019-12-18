const express = require('express');
const request = require('request-promise');
const router = express.Router();
function authenticated (req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/loginfailed');
}

router.get('/', authenticated, (req, res) => {
    request('http://127.0.0.1:3000/chat', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(chatObject => {
        let parsedObject = JSON.parse(chatObject);
        let user_id = req.user._id.toString();
        //console.log(user_id);

        parsedObject.chatrooms = parsedObject.chatrooms.filter(room => {
            return room.members.some(member => member._id == user_id);
        });

        res.cookie('user', user_id, { maxAge: 3600, httpOnly: false });
        res.render('chat', { "users": parsedObject.users, "chatrooms": parsedObject.chatrooms });
    });
});

module.exports = router;
