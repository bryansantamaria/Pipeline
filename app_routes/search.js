const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/user/:query', (req, res) => {
  console.log('Query recieved: ' + req.params.query)
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

module.exports = router;