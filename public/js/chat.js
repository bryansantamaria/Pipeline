import {
  ChatModule
} from "./chat-module.js";

import {
  Search
} from "./search-module.js";

import {
  UserListItem
} from "./userlistitem-module.js";

import {
  MentionsItem
} from "./mentions-item-module.js";

import {
  AddToChat
} from "./add-to-chat-module.js";

import {
  EmojiPicker
} from "./emojipicker-module.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#msgForm").hide();
});

$(".requestChatroom").on("click", function (e) {
  joinChatRoom(e);
});

var socket = io();

////////////////////////////////////////////////
//CRUD-events
////////////////////////////////////////////////

//Create private chat
document.querySelector('#create-pm-btn').addEventListener('click', () => {
  let usersInNewRoom = chatGlobals.addToRoom;
  usersInNewRoom.push(chatGlobals.user);

  fetch('/chatroom', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usersInNewRoom)
  }).then(res => res.json())
    .then(chatroom => {
      chatroom = JSON.parse(chatroom);
      console.log(chatroom);
      socket.emit('createdChatroom', chatroom);
    });
});

//For chatroom creation
document.querySelector('#create-chatroom-btn').addEventListener('click', (e) => {
  let chatroomName = chatGlobals.addChatroomName;
  chatroomName = document.getElementById("createChatroomName").value;
  if (chatroomName == '') {
    e.stopImmediatePropagation();
    alert("You must give a name to the chatroom you are trying to create!");
  }
  else {
    let usersInNewRoom = chatGlobals.addToRoom;
    usersInNewRoom.push(chatGlobals.user);
    fetch('/chatroom/newChatroom', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify([usersInNewRoom, chatroomName])
    }).then(res => res.json())
      .then(chatroom => {
        chatroom = JSON.parse(chatroom);
        console.log(chatroom);
        socket.emit('createdPublicChatroom', chatroom);
      });
  }
});

//Joins chatroom
function joinChatRoom(e) {
  $("#msgForm").show();
  $('message-root').empty();
  let chatroomID = e.target.id;
  console.log(chatroomID);
  chatGlobals.chatroomId = chatroomID;

  fetch('/chatroom/' + chatroomID).then(res => res.json()).then(chatroom => {
    chatroom = JSON.parse(chatroom);
    let chatroomMessages = chatroom[0].messages;

    chatMessages = [];
    chatroomMessages.forEach(msg => {
      let chatMessage = new ChatModule(
        msg.message,
        msg.alias,
        msg.avatar,
        msg.timestamp,
        msg._id,
        msg.mentions
      );
      if (chatGlobals.user._id == msg.alias) {
        chatMessage.setupEventListeners();
      }
      chatMessages.push(chatMessage);
      chatMessage.render(document.querySelector('message-root'));
    });

    updateAliases();

    //Render topbar
    let chatroomMembers = chatroom[0].members;
    let topBar = document.getElementById("topBar")
    topBar.innerHTML = '<h5 class="topbar-title">Members</h5>';
    let tBar = document.querySelector('top-bar');
    let marginLeftSpan = document.createElement('span');
    marginLeftSpan.id = 'marginLeft';
    tBar.appendChild(marginLeftSpan);
    for (var memberInArray = 0; memberInArray < chatroomMembers.length; memberInArray++) {
      let member = document.createElement('span');
      member.classList.add("membersInChatroom");
      if (chatroom[0].type === "privateMessage") {
        //member.innerHTML = chatroomMembers[memberInArray].alias;
        member.setAttribute('userid', chatroomMembers[memberInArray]._id);
        topBar.insertBefore(member, topBar.childNodes[1]);
      }
      else if (chatroom[0].type === "publicChannel") {
        //member.innerHTML = chatroomMembers[memberInArray].alias;
        member.setAttribute('userid', chatroomMembers[memberInArray]._id);
        topBar.insertBefore(member, topBar.childNodes[1]);
      }
    }

    updateTopbarSidebarAlias();

    socket.emit('joinedRoom', chatroomID);
  });
};

function createPM(chatroom) {
  if (chatroom.members.some(user => user._id == chatGlobals.user._id)) {
    console.log(chatroom);

    let div = document.createElement('div');
    let i = document.createElement('i');
    div.id = chatroom._id;
    div.classList.add('requestChatroom');
    i.classList.add('fas', 'fa-circle');
    div.appendChild(i);
    //let text = document.createTextNode(usersInChatroom);

    chatroom.members.forEach(user => {
      let span = document.createElement('span');
      span.innerText = user.alias;
      span.setAttribute('userid', user._id);
      div.appendChild(span);
    });

    document.querySelector('private-message').appendChild(div);

    div.addEventListener('click', e => {
      joinChatRoom(e);
    });

    chatGlobals.addToRoom = [];
  }
};

function createChannel(chatroom) {
  if (chatroom.members.some(user => user._id == chatGlobals.user._id)) {
    console.log(chatroom);
    let usersInChatroom = chatroom.name;
    let div = document.createElement('div');
    let i = document.createElement('i');
    let text = document.createTextNode(usersInChatroom);
    div.id = chatroom._id;
    div.classList.add('requestChatroom');
    i.classList.add('fas', 'fa-hashtag');
    div.appendChild(i);
    div.appendChild(text);

    document.querySelector('public-channels').appendChild(div);

    div.addEventListener('click', e => {
      joinChatRoom(e);
    });

    chatGlobals.addToRoom = [];
    chatGlobals.addChatroomName = '';
  }
};

//Delete events
document.addEventListener('delete-init', e => {
  chatGlobals.deleteTarget = e.detail;
});

document.querySelector('#delete-btn').addEventListener('click', () => {
  chatGlobals.deleteTarget.chatroom = chatGlobals.chatroomId;
  socket.emit('delete', chatGlobals.deleteTarget);
});

//Edit Events
document.addEventListener('edit-init', e => {
  chatGlobals.editTarget = e.detail;
  document.querySelector('#edit-message').value = chatGlobals.editTarget.html.textContent;
});

document.querySelector('#edit-btn').addEventListener('click', () => {
  let new_message = chatGlobals.editTarget.content;
  new_message.message = document.querySelector('#edit-message').value;
  new_message.chatroom = chatGlobals.chatroomId;
  socket.emit('edit', new_message);
});

//Send message
$("#msgForm").submit(function (e) {
  e.preventDefault();

  if (emojipicker.open) {
    document.querySelector('#open-emoji-picker').click();
  };

  if ($("#messageValue").val() == "") { } else {

    let chatMessage = {
      alias: chatGlobals.user._id,
      message: $("#messageValue").val(),
      avatar: chatGlobals.user.avatar,
      timestamp: getTodaysDate(),
      chatroom: chatGlobals.chatroomId,
      mentions: mentions.inLatestMessage
    };

    mentions.inLatestMessage.forEach(mention => {
      socket.emit('mention', { by: chatGlobals.user, for: mention });
    });

    mentions.inLatestMessage = [];

    if (debug) {
      console.log('Message sent to server >');
      console.log(chatMessage);
      console.log(chatGlobals.chatroomId);
    };

    //Emits the stringified chatMessage object to server.
    socket.emit("chat message", { roomId: chatGlobals.chatroomId, chatMessage: chatMessage });

    $("#messageValue").val('');
  };
});

function updateUser() {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  chatGlobals.user.email = html.edit_email.value;
  html.edit_email.innerText = chatGlobals.user.email;

  fetch('/user/edit/' + chatGlobals.user._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chatGlobals.user),
  })

  if (debug) {
    console.log('Sent edit request to server >');
    console.log(chatGlobals.user);
  }

};

//Function that triggers on change event, Post request to /uploadfiles

const handleImageUpload = event => {
  const files = event.target.files;
  const formData = new FormData()
  formData.append('profile_picture', files[0]);
  formData.append('_id', chatGlobals.user._id);

  fetch('/uploadfile', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log('DATA from uploadfile >');
    })
    .catch(error => {
      console.log(error);
    })
}

//Triggers handleImageUpload when uploading a picture.
document.querySelector('#filebtn').addEventListener('change', event => {
  handleImageUpload(event);
});

let editEmail = document.getElementById('edit-email');
let warning = document.getElementById('alertwarning');
//Sends request to server for user
document.querySelector('#update-profile-btn').addEventListener('click', (e) => {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  chatGlobals.user.email = html.edit_email.value;
  html.edit_email.innerText = chatGlobals.user.email;

  //Checks if input from user contains @ in the email field.
  if (editEmail.value.indexOf('@') > -1) {
    warning.style.display = 'none';
    updateUser();
  } else {
    warning.style.display = 'block';
    e.stopImmediatePropagation();
  }
});

////////////////////////////////////////////////
//SOCKETS
////////////////////////////////////////////////

//Renders incoming chat messages
socket.on('chat message', function (chatObject) {
  chatObject = JSON.parse(chatObject);

  if (debug) {
    console.log('Message recieved from server >');
    console.log(chatObject);
  }

  //Loads in the now parsed chatobject and loads it's content into chatmessageModel
  let chatMessage = new ChatModule(
    chatObject.message,
    chatObject.alias,
    chatObject.avatar,
    chatObject.timestamp,
    chatObject._id,
    chatObject.mentions
  );

  if (debug) {
    console.log('Message recieved from server >');
    console.log(chatMessage);
  }

  if (chatGlobals.user._id == chatMessage.content.alias) {
    chatMessage.setupEventListeners();
  }

  chatMessages.push(chatMessage);
  chatMessage.updateAlias();
  chatMessage.render(document.querySelector('message-root'));
});

//Socket on får data från server, Socket emit skickar data till servern.
socket.on('new-user-online', users => {
  while (document.getElementById('users-online').firstChild) {
    document.getElementById('users-online').removeChild(document.getElementById('users-online').firstChild);
  }

  for (let i = 0; i < users.length; i++) {
    let div = document.createElement('div');
    div.innerText = users[i].alias;
    div.id = users[i]._id;
    div.setAttribute('userid', users[i]._id);
    document.getElementById('users-online').appendChild(div);
  }
});

socket.on('checkOnline', (status) => {
  if (status._id === chatGlobals.user._id) {
    socket.emit('checkOnline', status);
  }
});

socket.on('createdChatroom', chatroom => {
  if (debug) console.log(chatroom);
  if (chatroom.members.some(member => member._id == chatGlobals.user._id)) {
    createPM(chatroom);
  }
})

socket.on('createdPublicChatroom', chatroom => {
  if (debug) console.log(chatroom);
  if (chatroom.members.some(member => member._id == chatGlobals.user._id)) {
    createChannel(chatroom);
  }
})

//Shows when a user is typing, end on enter.
socket.on('typing', (alias) => {
  if (alias) {
    $('#typing').html(alias + ' is typing...');
  } else {
    $('#typing').html('');
  }

  if (debug) console.log(chatGlobals.user.alias);
});

$('#messageValue').keyup((e) => {
  if (e.which === 13) {
    socket.emit('typing', false);
  } else if ($('#messageValue').val() !== '') {
    socket.emit('typing', chatGlobals.user.alias, true);
    if (debug) console.log('TRUEEE');
    if (debug) console.log(chatGlobals.user.alias);
  } else {
    socket.emit('typing', false);
  }
});

//Loopa igenom alla chatmeddelanden, kontrollera id och rendera ut det nya editerade meddelandet.
socket.on('edit', edited_message => {

  if (debug) {
    console.log('Edit from server >')
    console.log(edited_message);
  }

  console.log(chatMessages);

  chatMessages.forEach(message => {
    console.log(message);
    if (message.content._id == edited_message._id) {
      message.edit(edited_message.message, false);
    }
  });
});

//Loopa igenom alla chatmeddelanden, kontrollera id och radera meddelandet.
socket.on('delete', delete_message => {

  if (debug) {
    console.log('Delete request from server for msg >');
    console.log(delete_message);
  }

  chatMessages.forEach(message => {
    if (message.content._id == delete_message._id) {
      message.delete();
    }
  });
});

//Displays mention alert if user is mentioned
socket.on('mention', mention => {
  if (mention.for._id == chatGlobals.user._id) {
    document.querySelector('#mention-message').innerText = `${mention.by.alias} mentioned you.`
    document.querySelector('#mention-alert').classList.add('show');
  }
})

socket.on("disconnect", () => {
  console.log(socket.disconnected);
});

//Dismisses mention alert
document.querySelector('#mention-dismiss').addEventListener('click', () => {
  document.querySelector('#mention-alert').classList.remove('show');
});

//Genererar dagens datum och tid, convertar från millisekunder.
function getTodaysDate(date) {
  var rightNow;
  date ? rightNow = new Date(date) : rightNow = new Date();
  var dd = String(rightNow.getDate()).padStart(2, '0');
  var mm = String(rightNow.getMonth() + 1).padStart(2, '0');
  var h = rightNow.getHours();
  var m = rightNow.getMinutes();

  var yyyy = rightNow.getFullYear();
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;

  if (dd == new Date().getDate()) {
    rightNow = h + ":" + m;
  } else {
    rightNow = yyyy + '-' + mm + '-' + dd + ' ' + h + ":" + m;
  }

  return rightNow;
}

////////////////////////////////////////////////
//Bootstrap linking
////////////////////////////////////////////////

//Cursed bootstrap attributes
document.querySelector('#private-message-title').setAttribute("data-toggle", "modal");
document.querySelector('#private-message-title').setAttribute("data-target", "#create-pm-modal");

document.querySelector('#channel-title').setAttribute("data-toggle", "modal");
document.querySelector('#channel-title').setAttribute("data-target", "#create-chatroom-modal");

document.querySelector('#user-settings').setAttribute("data-toggle", "modal");
document.querySelector('#user-settings').setAttribute("data-target", "#edit-profile-modal");

document.querySelector('user-name').setAttribute("data-toggle", "modal");
document.querySelector('user-name').setAttribute("data-target", "#edit-profile-modal");

let chatMessages = [];

/////////////////////////////////////////////////////
/// CREATE PM
/////////////////////////////////////////////////////

let userSearch = new Search('user', document.querySelector('#create-pm-modal'));
let chatroomUserSearch = new Search('user', document.querySelector('#create-chatroom-modal'));
let addToRoomModules = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#create-pm-user-search').addEventListener('input', e => {
    let query = e.target.value;
    if (debug) console.log('Searched for: ' + query);
    userSearch.search(query);

    if (query == '') {
      let userList = document.querySelector('user-list');

      while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
      };
    };
  });

  document.querySelector('#create-pm-modal').addEventListener('search-result', e => {
    let userList = document.querySelector('user-list');

    while (userList.firstChild) {
      userList.removeChild(userList.firstChild);
    };

    e.detail.forEach(user => {
      let item = new UserListItem(document.querySelector('user-list'), user);
      item.render();
    });
  });

  //Adds the user clicked on to list of users in new chat room
  document.querySelector('user-list').addEventListener('user-added', e => {
    if (!chatGlobals.addToRoom.some(user => user._id == e.detail._id)) {
      chatGlobals.addToRoom.push(e.detail);
      let addToRoom = new AddToChat(document.querySelector('users-to-add'), e.detail);
      addToRoomModules.push(addToRoom);
      addToRoom.render();
    };
    if (debug) console.log(chatGlobals.addToRoom);
  });

  document.querySelector('users-to-add').addEventListener('user-removed', e => {
    chatGlobals.addToRoom = chatGlobals.addToRoom.filter(user => user._id != e.detail._id)
    if (debug) console.log(chatGlobals.addToRoom);
  });
});

/////////////////////////////////////////////////////
/// CREATE CHATROOM
/////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  let chatroomUserList = document.querySelector('chatroom-user-list');
  document.querySelector('#chatroom-user-search').addEventListener('input', e => {
    let query = e.target.value;
    if (debug) console.log('Searched for: ' + query);
    chatroomUserSearch.search(query);
    if (query == '') {
      while (chatroomUserList.firstChild) {
        chatroomUserList.removeChild(chatroomUserList.firstChild);
      };
    };
  });

  document.querySelector('#create-chatroom-modal').addEventListener('search-result', e => {

    while (chatroomUserList.firstChild) {
      chatroomUserList.removeChild(chatroomUserList.firstChild);
    };

    e.detail.forEach(user => {
      let item = new UserListItem(chatroomUserList, user);
      if (item.user._id !== chatGlobals.user._id) item.render();
    });
  });

  //Adds the user clicked on to list of users in new chat room
  chatroomUserList.addEventListener('user-added', e => {
    let chatGlobalsAddMemberToRoom = chatGlobals.addToRoom;
    if (!chatGlobalsAddMemberToRoom.some(user => user._id == e.detail._id)) {
      chatGlobalsAddMemberToRoom.push(e.detail);
      let addToRoom = new AddToChat(document.querySelector('chatroom-users-to-add'), e.detail);
      addToRoomModules.push(addToRoom);
      addToRoom.render();
    };
    if (debug) console.log(chatGlobals.addToRoom);
  });

  document.querySelector('chatroom-users-to-add').addEventListener('user-removed', e => {
    chatGlobals.addToRoom = chatGlobals.addToRoom.filter(user => user._id != e.detail._id)
    if (debug) console.log(chatGlobals.addToRoom);
  });
});

/////////////////////////////////////////////////////
/// MENTIONS
/////////////////////////////////////////////////////

let mentions = {
  inMention: false,
  start: 0,
  query: '',
  users: new Search('user', document.querySelector('mentions-root')),
  clear: () => {
    mentions.query = '';
    document.querySelector('mentions-root').innerHTML = '';
    document.querySelector('mentions-root').classList.add('hidden');
    document.querySelector('overlay-root').classList.add('hidden');
  },
  inLatestMessage: []
};

function isSpace(char) {
  var space = new RegExp(/^\s$/);
  return space.test(char.charAt(0));
};

document.querySelector('#messageValue').addEventListener('input', () => {

  let msg = document.querySelector('#messageValue');

  if (!mentions.inMention) {
    mentions.clear();
  }

  if (msg.value.substr(msg.value.length - 1 == '@') && (isSpace(msg.value.substr(msg.value.length - 2)) || msg.value.length == 1) && !mentions.inMention) {
    mentions.start = msg.value.length;
    mentions.inMention = true;
    mentions.clear();
  }

  if (msg.value.charAt(mentions.start - 1) != '@' || (mentions.inMention && isSpace(msg.value.substr(msg.value.length - 1)))) {
    mentions.inMention = false;
  }

  if (mentions.inMention) {
    mentions.query = msg.value.substr(mentions.start);
    document.querySelector('mentions-root').classList.remove('hidden')
    if (debug) console.log(mentions);
    if (debug) console.log(msg.value.charAt(mentions.start - 1));
    mentions.users.search(mentions.query);

    document.querySelector('overlay-root').classList.remove('hidden');
  }
});

document.querySelector('mentions-root').addEventListener('search-result', e => {
  if (debug) console.log(e.detail);
  document.querySelector('mentions-root').innerHTML = '';

  e.detail.forEach(user => {
    if (debug) console.log(user);
    let mentionsItem = new MentionsItem(document.querySelector('mentions-root'), user);
    mentionsItem.render();
  })
});

document.querySelector('mentions-root').addEventListener('mention-user', e => {
  mentions.inMention = false;
  let msg = document.querySelector('#messageValue');
  if (debug) console.log(e.detail);

  msg.value = msg.value.replace(`@${mentions.query}`, `@${e.detail.alias} `);

  mentions.inLatestMessage.push(e.detail);

  if (debug) console.log('Mentioned in message >');
  if (debug) console.log(mentions.inLatestMessage);

  msg.focus();
  mentions.clear();
});

/////////////////////////////////////////////////////
/// EMOJI PICKER
/////////////////////////////////////////////////////

let emojipicker = new EmojiPicker(document.querySelector('#open-emoji-picker'), document.querySelector('#messageValue'));

emojipicker.render();

/////////////////////////////////////////////////////
/// UPDATE MESSAGES BY UID
/////////////////////////////////////////////////////

function updateAliases() {
  chatMessages.forEach(message => {
    message.updateAlias();
  });
};
