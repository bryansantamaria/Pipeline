const express = require('express');
const request = require('request-promise');
const router = express.Router();
const fileUpload = require('express-fileupload');

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
            let profile_pic = req.files.profile_picture;
            console.log(profile_pic);
            //mv() method places the file in public/images directory
            profile_pic.mv('./public/images/' + profile_pic.name);
            request('http://127.0.0.1:3000/uploadfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({path: `/images/${profile_pic.name}`}),
            }).then(() => {
                res.redirect('chat');
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;