const express = require('express');
const request = require('request-promise');
const router = express.Router();
var passport = require('passport');
// LocalStrategy = require('passport-local').Strategy;

router.post('/', (req, res, next) => {
    console.log(req.body);
    request('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body),
    })/*.then((user) => {
        if (JSON.parse(user))
            req.session.user = JSON.parse(user);
    }); */
});

// app.post('/',
//     passport.authenticate('local', {
//         successRedirect: 'localhost:5000/chat',
//         failureRedirect: '/',
//         failureFlash: true
//     })
// );
// router.post('/', (req, res) => {
//     request('http://127.0.0.1:3000/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(req.body),
//     }).then((user) => {
//         if (JSON.parse(user)) {
//             req.session.user = JSON.parse(user);

//             res.redirect('chat');
//         } else {
//             res.redirect('/loginfailed');
//         }
//     });
// });

module.exports = router;