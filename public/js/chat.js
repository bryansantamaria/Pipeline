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

////////////////////////////////////////////////
//Globals
////////////////////////////////////////////////
let chatGlobals = {
  deleteTarget: undefined,
  editTarget: undefined,
  user: undefined,
  chatroomId: '5deeabc57873593ac0902e8e',
  addToRoom: [],
  addChatroomName: ''
}

let html = {
  edit_alias: document.querySelector('#edit-alias'),
  edit_email: document.querySelector('#edit-email'),
  alias: document.querySelector('#alias')
}

let uid = String(document.cookie).replace('user=', '');

fetch('user/' + uid).then(userdata => {
  return userdata.json();
}).then(jsondata => {
  chatGlobals.user = JSON.parse(jsondata);
  html.edit_alias.value = chatGlobals.user.alias
  html.edit_email.value = chatGlobals.user.email
  socket.emit('new-user-online', chatGlobals.user);
  html.alias.innerText = chatGlobals.user.alias;
  let pictureID = document.getElementById('pictureID');
  pictureID.value = chatGlobals.user._id;
  document.querySelector('#edit-profile-preview').setAttribute('src', `/images/${chatGlobals.user._id}.jpg`);
}).catch(() => {
  location.reload();
});

$(".requestChatroom").on("click", function (e) {
  joinChatRoom(e);
});

var socket = io();

////////////////////////////////////////////////
//CRUD-events
////////////////////////////////////////////////

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
      socket.emit('createdChatroom', chatroom);
    });
});

document.querySelector('#create-chatroom-btn').addEventListener('click', () => {
  let usersInNewRoom = chatGlobals.addToRoom;
  let chatroomName = chatGlobals.addChatroomName;
  chatroomName = document.getElementById("createChatroomName").value;
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
      socket.emit('createdPublicChatroom', chatroom);
    });
});

function joinChatRoom(e) {
  $('message-root').empty();
  let chatroomID = e.target.id;
  chatGlobals.chatroomId = chatroomID;

  fetch('/chatroom/' + chatroomID).then(res => res.json()).then(chatroom => {
    chatroom = JSON.parse(chatroom);
    let chatroomMessages = chatroom[0].messages;
    chatroomMessages.forEach(msg => {
      let chatMessage = new ChatModule(
        msg.message,
        msg.alias,
        msg.avatar,
        msg.timestamp,
        msg._id,
        msg.mentions
      );
      if (chatGlobals.user.alias == msg.alias) {
        chatMessage.setupEventListeners();
      }

      chatMessage.render(document.querySelector('message-root'))
    });

    let chatroomMembers = chatroom[0].members;
    let topBar = document.getElementById("topBar")
    topBar.innerHTML = '<h5 class="topbar-title">Members</h5>';
    for (var memberInArray = 0; memberInArray < chatroomMembers.length; memberInArray++) {
      let member = document.createElement('span');
      member.classList.add("membersInChatroom");
      if (chatroom[0].type === "privateMessage") {
        member.innerHTML = chatroomMembers[memberInArray].alias;
        topBar.insertBefore(member, topBar.childNodes[1]);
      }
      else if(chatroom[0].type === "publicChannel"){
        member.innerHTML = chatroomMembers[memberInArray].alias;
        topBar.insertBefore(member, topBar.childNodes[1]);
      }
    }
    socket.emit('joinedRoom', chatroomID);
  });
};

function createPM(chatroom) {
  if(chatroom.members.some(user => user._id == chatGlobals.user._id)) {
    let usersInChatroom = ' ';
    chatroom.members.forEach(user => {
      usersInChatroom += user.alias + ' ';
    });

    let div = document.createElement('div');
    let i = document.createElement('i');
    let text = document.createTextNode(usersInChatroom);
    div.id = chatroom._id;
    div.classList.add('requestChatroom');
    i.classList.add('fas', 'fa-circle');
    div.appendChild(i);
    div.appendChild(text);

    document.querySelector('private-message').appendChild(div);

    div.addEventListener('click', e => {
      joinChatRoom(e);
    });

    chatGlobals.addToRoom = [];
  }
};

function createChannel(chatroom) {
  if(chatroom.members.some(user => user._id == chatGlobals.user._id)) {
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

document.addEventListener('delete-init', e => {
  chatGlobals.deleteTarget = e.detail;
});

document.querySelector('#delete-btn').addEventListener('click', () => {
  chatGlobals.deleteTarget.chatroom = chatGlobals.chatroomId;
  socket.emit('delete', chatGlobals.deleteTarget);
});

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

$("#msgForm").submit(function (e) {
  e.preventDefault();

  if(emojipicker.open) {
    document.querySelector('#open-emoji-picker').click();
  };

  if ($("#messageValue").val() == "") { } else {

    let chatMessage = {
      alias: chatGlobals.user.alias,
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
};

document.querySelector('#update-profile-btn').addEventListener('click', () => {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  chatGlobals.user.email = html.edit_email.value;
  html.edit_email.innerText = chatGlobals.user.email;

  updateUser();
});

////////////////////////////////////////////////
//SOCKETS
////////////////////////////////////////////////

socket.on('chat message', function (chatObject) {
  chatObject = JSON.parse(chatObject);

  let chatMessage = new ChatModule(
    chatObject.message,
    chatObject.alias,
    chatObject.avatar,
    chatObject.timestamp,
    chatObject._id,
    chatObject.mentions
  );

  if (chatGlobals.user.alias == chatMessage.content.alias) {
    chatMessage.setupEventListeners();
  }

  chatMessages.push(chatMessage);
  chatMessage.render(document.querySelector('message-root'));
});

socket.on('new-user-online', users => {
  while (document.getElementById('users-online').firstChild) {
    document.getElementById('users-online').removeChild(document.getElementById('users-online').firstChild);
  }

  for (let i = 0; i < users.length; i++) {
    let div = document.createElement('div');
    div.innerText = users[i].alias;
    div.id = users[i]._id;
    document.getElementById('users-online').appendChild(div);
  }
});

socket.on('checkOnline', (status) => {
  if (status._id === chatGlobals.user._id) {
    socket.emit('checkOnline', status);
  }
});

socket.on('createdChatroom', chatroom => {
  if(chatroom.members.some(member => member._id == chatGlobals.user._id)) {
    createPM(chatroom);
  }
})

socket.on('createdPublicChatroom', chatroom => {
  if(chatroom.members.some(member => member._id == chatGlobals.user._id)) {
    createChannel(chatroom);
  }
})

socket.on('typing', (alias) => {
  if(alias) {
    $('#typing').html(alias + ' is typing...');
  } else {
    $('#typing').html('');
  }
});

$('#messageValue').keyup((e) => {
  if (e.which === 13) {
    socket.emit('typing', false);
  } else if ($('#messageValue').val() !== '') {
    socket.emit('typing', chatGlobals.user.alias, true);
  } else {
    socket.emit('typing', false);
  }
});

socket.on('edit', edited_message => {
  edited_message = JSON.parse(edited_message);
  chatMessages.forEach(message => {
    if (message._id == edited_message._id) {
      message.edit(edited_message.message, false);
    }
  });
});

socket.on('delete', delete_message => {
  delete_message = JSON.parse(delete_message);

  chatMessages.forEach(message => {
    if (message.content._id == delete_message._id) {
      message.delete();
    }
  });
});

socket.on('mention', mention => {
  if (mention.for._id == chatGlobals.user._id) {
    document.querySelector('#mention-message').innerText = `${mention.by.alias} mentioned you.`
    document.querySelector('#mention-alert').classList.add('show');
  }
})

socket.on("disconnect", () => {});

document.querySelector('#mention-dismiss').addEventListener('click', () => {
  document.querySelector('#mention-alert').classList.remove('show');
});

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

  document.querySelector('user-list').addEventListener('user-added', e => {
    if (!chatGlobals.addToRoom.some(user => user._id == e.detail._id)) {
      chatGlobals.addToRoom.push(e.detail);
      let addToRoom = new AddToChat(document.querySelector('users-to-add'), e.detail);
      addToRoomModules.push(addToRoom);
      addToRoom.render();
    };
  });

  document.querySelector('users-to-add').addEventListener('user-removed', e => {
    chatGlobals.addToRoom = chatGlobals.addToRoom.filter(user => user._id != e.detail._id)
  });
});

/////////////////////////////////////////////////////
/// CREATE CHATROOM
/////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', () => {
  let chatroomUserList = document.querySelector('chatroom-user-list');
  document.querySelector('#chatroom-user-search').addEventListener('input', e => {
    let query = e.target.value;
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

  chatroomUserList.addEventListener('user-added', e => {
    let chatGlobalsAddMemberToRoom = chatGlobals.addToRoom;
    if (!chatGlobalsAddMemberToRoom.some(user => user._id == e.detail._id)) {
      chatGlobalsAddMemberToRoom.push(e.detail);
      let addToRoom = new AddToChat(document.querySelector('chatroom-users-to-add'), e.detail);
      addToRoomModules.push(addToRoom);
      addToRoom.render();
    };
  });

  document.querySelector('chatroom-users-to-add').addEventListener('user-removed', e => {
    chatGlobals.addToRoom = chatGlobals.addToRoom.filter(user => user._id != e.detail._id)
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
    mentions.users.search(mentions.query);

    document.querySelector('overlay-root').classList.remove('hidden');
  }
});

document.querySelector('mentions-root').addEventListener('search-result', e => {
  document.querySelector('mentions-root').innerHTML = '';

  e.detail.forEach(user => {
    let mentionsItem = new MentionsItem(document.querySelector('mentions-root'), user);
    mentionsItem.render();
  })
});

document.querySelector('mentions-root').addEventListener('mention-user', e => {
  mentions.inMention = false;
  let msg = document.querySelector('#messageValue');

  msg.value = msg.value.replace(`@${mentions.query}`, `@${e.detail.alias} `);

  mentions.inLatestMessage.push(e.detail);
  msg.focus();
  mentions.clear();
});

/////////////////////////////////////////////////////
/// EMOJI PICKER
/////////////////////////////////////////////////////

let emojipicker = new EmojiPicker(document.querySelector('#open-emoji-picker'), document.querySelector('#messageValue'));

emojipicker.render();
