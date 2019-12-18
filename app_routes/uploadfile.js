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
    // console.log('REQBODY > HEHE')
    // console.log(req.files);
    console.log('REQ.FILES.PROFILE_PICTURE: >')
    console.log(req.files.profile_picture);
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
                        if (err) throw err

                        console.log('After conversion >');
                        // console.log(img);
                        request('http://127.0.0.1:3000/uploadfile', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ path: `./public/images/'${req.body._id}.jpg` }),
                        }).then(() => {
                            console.log('IT WOOORKS!');
                            res.send('200'); //Plocka bort eller ersätt till res 200
                           
                        });
                    })
                })
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;