const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/user/:query', (req, res) => {
  request('http://127.0.0.1:3000/search/user/' + req.params.query, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body),
  }).then(result => {
    res.json(result);
  });
});

router.get('/emoji/:category', (req, res) => {
  request('http://127.0.0.1:3000/search/emoji/' + req.params.category, {
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
