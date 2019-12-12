// const express = require('express');
// const request = require('request-promise');
// const router = express.Router();
// const fileUpload = require('express-fileupload');
// const cors = require('cors');

// router.use(cors());
// //Enable files upload
// router.use(fileUpload({
//     createParentPath: true
//   }));

// router.post('/', async (req, res) => {
//     console.log('req.files');
//     console.log(req.files);
//     try {
//         if (!req.files) {
//             res.send({
//                 status: false,
//                 message: 'No file uploaded'
//             });
//         } else {
//             let profile_pic = req.files.profile_pic;
//             console.log('works');
//             console.log(profile_pic);
//             //mv() method places the file in upload directory
//             profile_pic.mv('../public/images' + profile_pic.name);
//             request('http://127.0.0.1:3000/uploadfile', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'image/png'
//                 },
//                 body: req.files,
//             }).then(image => {
//                 req.files.image = image;
//                 console.log(image);
//                 res.send('200', {
//                      status: true,
//                      message: 'File is uploaded',
//                      data: {
//                         name: profile_pic.name,
//                         mimetype: profile_pic.mimetype,
//                         size: profile_pic.size
//                      }
//                      });
//                 console.log(image);
//             });
//         }
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const _ = require('lodash');
const request = require('request-promise');
const router = express.Router();
const path = require('path');
// enable files upload
router.use(fileUpload());
//router.use(express.static(path.join(__dirname, 'public')));

//add other middleware 
router.use(cors());

router.post('/', async (req, res) => {
    console.log(req);
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "profile_pic") to retrieve the uploaded file
            let profile_pic = req.files.profile_pic;
            console.log(profile_pic);
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            profile_pic.mv('/images' + profile_pic.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: profile_pic.name,
                    mimetype: profile_pic.mimetype,
                    size: profile_pic.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;