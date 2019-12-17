const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
const monk = require("monk");
const pipelineDB = monk('localhost:27017/pipeline');
const successPort = 'http://127.0.0.1:5000/chat';
const deniedPort = 'http://127.0.0.1:5000/loginfailed';

router.post('/', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: successPort,
        failureRedirect: deniedPort,
        failureFlash: true
    })(req, res, next);
});

passport.use(
    new LocalStrategy(/*{ usernameField: username },*/ (username, password, done) => {
        let collection = pipelineDB.get('users');
        console.log('USERNAME: >');
        console.log(username);
        collection.find({ $or: [{ "alias": username}, { "email": username }] }, {}).then(user => {
            if (user[0]) {
                bcrypt.compare(password, user[0].password, (err, authorized) => {
                    if (err) throw err;
                    if (authorized) {
                        
                        let userobject = {
                            'alias': user[0].alias,
                            '_id': user[0]._id
                        }
                        // res.send(userobject);
                        return done(null, userobject);

                    } else {
                        // res.send(false);
                        return done(null, false, {message: 'Not registered'});
                    }
                });
            } else {
                // res.send(false);
                return done(null, false);
            }
        });
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    collection.findById(id, (err, user) => {
        done(err, user);
    });
});


// router.post('/', async (req, res) => {
//     var pipelineDB = req.db;
//     var collection = pipelineDB.get("users");
//     collection.find({ $or: [{ "alias": req.body.username }, { "email": req.body.username }] }, {}).then(user => {
//         console.log('USER: ' + user);
//         if (user[0]) {
//             bcrypt.compare(req.body.password, user[0].password, (err, authorized) => {
//                 if (err) throw err;
//                 if (authorized) {
//                     let userobject = {
//                         'alias': user[0].alias,
//                         '_id': user[0]._id
//                     }
//                     res.send(userobject);
//                 } else {
//                     res.send(false);
//                 }
//                 console.log('Password correct: ', authorized);
//             });

//         } else {
//             res.send(false);
//         }
//     });
// });

// passport.use(new LocalStrategy(
//     function (username, password, done) {
//         User.findOne({ username: username }, function (err, user) {
//             if (err) { return done(err); }
//             if (!user) {
//                 return done(null, false, { message: 'Incorrect username.' });
//             }
//             if (!user.validPassword(password)) {
//                 return done(null, false, { message: 'Incorrect password.' });
//             }
//             return done(null, user);
//         });
//     }
// ));
// app.post('/',
//     passport.authenticate('local', {
//         successRedirect: 'localhost:5000/chat',
//         failureRedirect: '/',
//         failureFlash: true
//     })
// );

module.exports = router;
