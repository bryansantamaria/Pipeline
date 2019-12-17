const express = require('express');
const request = require('request-promise');
const router = express.Router();
const passport = require('passport');

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/chat',
        failureRedirect: '/loginfailed'
    })(req, res, next)
});

module.exports = router;