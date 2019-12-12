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
    console.log(req.body._id);
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log(req.files.profile_picture.data);
            let height;
            sharp(req.files.profile_picture.data)
                .jpeg()
                .toFile('img.jpg')
                .then(img => {
                    
                })
                .then(img => {
                    fs.writeFile('./public/images/' + req.body._id + '.jpg', img, (err) => {
                        if (err) throw err

                        console.log('After conversion >');
                        console.log(img);
                        //mv() method places the file in public/images directory
                        //profile_pic.mv('./public/images/' + req.body._id + '.jpg');
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