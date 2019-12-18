const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.post('/', (req, res) => {
  request('http://127.0.0.1:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body),
  });
  res.redirect('/');
});

module.exports = router;
