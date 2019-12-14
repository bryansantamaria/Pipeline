const express = require('express');
const request = require('request-promise');
const router = express.Router();

router.get('/:id', (req, res) => {
    console.log(req.params);
    request('http://127.0.0.1:3000/user/' + req.params.id, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(user => {
        res.json(user);
    });
})

router.get('/profile/:alias', (req, res) => {
    request('http://127.0.0.1:3000/user/' + req.params.alias, {
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
    console.log('Edit request for user >');
    console.log(req.body);
    request('http://127.0.0.1:3000/user/' + req.params.id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    }).then(user => {
        res.send('200');
    });
});

module.exports = router;