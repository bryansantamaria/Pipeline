function updateTopbarSidebarAlias() {
    let usersSearchedFor = [];
    Array(document.querySelectorAll('[userid]'))[0].forEach(node => {
      if (!usersSearchedFor.some(id => id == node.getAttribute('userid'))) {
        usersSearchedFor.push(node.getAttribute('userid'));
        fetch('user/' + node.getAttribute('userid'))
          .then(res => res.json())
          .then(user => {
            user = JSON.parse(user);
            console.log(user);
            Array(document.querySelectorAll(`[userid = "${user._id}"]`))[0].forEach(node => {
              node.innerText = user.alias;
            })
          })
      }
    });
  }

  let chatGlobals = {
    deleteTarget: undefined,
    editTarget: undefined,
    user: undefined,
    chatroomId: '5deeabc57873593ac0902e8e',
    addToRoom: [],
    addChatroomName: ''
  }

  let debug = true;

  let html;

  var socket = io();

  //Gets user from DB
  fetch('user/' + document.querySelector('#user-id').textContent).then(userdata => {
    return userdata.json();
  }).then(jsondata => {
    chatGlobals.user = JSON.parse(jsondata);

    document.addEventListener('DOMContentLoaded', () => {
      html = {
        edit_alias: document.querySelector('#edit-alias'),
        edit_email: document.querySelector('#edit-email'),
        alias: document.querySelector('#alias'),
        upload_picture: document.querySelector('#filebtn')
      };

      html.edit_alias.value = chatGlobals.user.alias;
      html.edit_email.value = chatGlobals.user.email;

      socket.emit('new-user-online', chatGlobals.user);
      html.alias.innerText = chatGlobals.user.alias;

      let pictureID = document.getElementById('pictureID');
      pictureID.value = chatGlobals.user._id;

      document.querySelector('#edit-profile-preview').setAttribute('src', `/images/${chatGlobals.user._id}.jpg`);
      updateTopbarSidebarAlias();
    })

  }).catch(() => {
    location.reload();
  });