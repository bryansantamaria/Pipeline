const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/:id', (req, res) => {
    request('http://127.0.0.1:3000/user/' + req.params.id, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(user => {
        res.json(user)
    });
})

//Updates user
router.put('/edit/:id', (req, res) => {
    request('http://127.0.0.1:3000/user/' + req.params.id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }).then(user => {
        res.send('200');
    });
})

module.exports = router;