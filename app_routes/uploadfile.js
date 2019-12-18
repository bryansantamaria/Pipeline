const express = require('express');
const request = require('request-promise');
const router = express.Router();
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const fs = require('fs');

router.use(fileUpload({
    createParentPath: true
}));

router.post('/', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let height;
            sharp(req.files.profile_picture.data)
                .jpeg()
                .toBuffer()
                .then(img => {
                    fs.writeFile('./public/images/' + req.body._id + '.jpg', img, (err) => {
                        if (err) throw err;
                        request('http://127.0.0.1:3000/uploadfile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ path: `./public/images/'${req.body._id}.jpg` }),
                        }).then(() => {
                            res.redirect('chat');
                        });
                    })
                })
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
