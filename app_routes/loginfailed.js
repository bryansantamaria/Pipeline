const express = require('express');
const router = express.Router();

//GET login failed page.
router.get('/', (req, res) => {
    res.render('index', {"loginfailed": true});
});

module.exports = router;
