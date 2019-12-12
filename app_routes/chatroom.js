const express = require('express');
const request = require('request-promise');
const router = express.Router();

//Get all chatrooms.
router.get("/", function(req, res) {
  request("http://127.0.0.1:3000/chatroom/", {
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(chatroom => {
    res.json(chatroom);
  });
});

//GET specific chatroom.
router.get("/:chatroom", function(req, res) {
  request("http://127.0.0.1:3000/chatroom/" + req.params.chatroom, {
    method: "get",
    headers: {
      "Content-Type": "application/json"
    }
  }).then(chatroom => {
    res.json(chatroom);
  });
});

module.exports = router;
