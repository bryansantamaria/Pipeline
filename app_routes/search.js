const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/user/:username', (req, res) => {
  request('http://127.0.0.1:3000/search/user/' + req.params.username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body),
  }).then(result => {
    res.json(result);
  });
});

module.exports = router;