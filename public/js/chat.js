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

////////////////////////////////////////////////
//Globals
////////////////////////////////////////////////
let chatGlobals = {
  deleteTarget: undefined,
  editTarget: undefined,
  user: undefined,
  chatroomId: 'dab123',
  addToRoom: []
}

let debug = true;

let html = {
  edit_alias: document.querySelector('#edit-alias'),
  alias: document.querySelector('#alias')
}

let uid = String(document.cookie).replace('user=', '');

fetch('user/' + uid).then(userdata => {
  return userdata.json();
}).then(jsondata => {
  chatGlobals.user = JSON.parse(jsondata);
  html.edit_alias.value = chatGlobals.user.alias
  console.log(chatGlobals.user);
  html.alias.innerText = chatGlobals.user.alias;
  let pictureID = document.getElementById('pictureID');
  pictureID.value = chatGlobals.user._id;
  document.querySelector('#edit-profile-preview').setAttribute('src', `/images/${chatGlobals.user._id}.jpg`);
});

$(".requestChatroom").on("click", function(){
  $('message-root').empty();
  let chatroomID = this.id;

  fetch('/chatroom/'+ chatroomID).then(res => {
    return res.json();
  }).then(chatroom => {
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
      if(chatGlobals.user.alias == msg.alias) {
        chatMessage.setupEventListeners();
      }

      chatMessage.render(document.querySelector('message-root'))
    });
  });
});

var socket = io();

////////////////////////////////////////////////
//CRUD-events
////////////////////////////////////////////////

//Delete events
document.addEventListener('delete-init', e => {
  chatGlobals.deleteTarget = e.detail;
});

document.querySelector('#delete-btn').addEventListener('click', () => {
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

  socket.emit('edit', new_message);
});

//Send message
$("#msgForm").submit(function (e) {
  e.preventDefault();
  if ($("#messageValue").val() == "") { } else {
    let chatMessage = {
      alias: chatGlobals.user.alias,
      message: $("#messageValue").val(),
      avatar: chatGlobals.user.avatar,
      timestamp: getTodaysDate(),
      chatroom: chatGlobals.chatroomId,
      mentions: mentions.inLatestMessage
    }

    mentions.inLatestMessage.forEach(mention => {
      socket.emit('mention', {by: chatGlobals.user, for: mention});
    })

    mentions.inLatestMessage = [];

    if(debug) {
      console.log('Message sent to server >');
      console.log(chatMessage);
    }

    //Emits the stringified chatMessage object to server.
    socket.emit("chat message", JSON.stringify(chatMessage));

    $("#messageValue").val('');
  }
});

function updateUser() {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  fetch('/user/edit/' + chatGlobals.user._id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chatGlobals.user),
  })

  if(debug) {
    console.log('Sent edit request to server >');
    console.log(chatGlobals.user);
  }
}

//Sends request to server for user
document.querySelector('#update-profile-btn').addEventListener('click', () => {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  updateUser();
});

////////////////////////////////////////////////
//SOCKETS
////////////////////////////////////////////////

//Renders incoming chat messages
socket.on('chat message', function (chatObject) {
  chatObject = JSON.parse(chatObject);

  if(debug) {
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

  if(debug) {
    console.log('Message recieved from server >');
    console.log(chatMessage);
  }

  if(chatGlobals.user.alias == chatMessage.content.alias) {
    chatMessage.setupEventListeners();
  }

  chatMessages.push(chatMessage);
  chatMessage.render(document.querySelector('message-root'));
});

//Loopa igenom alla chatmeddelanden, kontrollera id och rendera ut det nya editerade meddelandet.
socket.on('edit', edited_message => {
  edited_message = JSON.parse(edited_message);

  if(debug) {
    console.log('Edit from server >')
    console.log(edited_message);
  }

  chatMessages.forEach(message => {
    if (message._id == edited_message._id) {
      message.edit(edited_message.message, false);
    }
  });
});

//Loopa igenom alla chatmeddelanden, kontrollera id och radera meddelandet.
socket.on('delete', delete_message => {
  delete_message = JSON.parse(delete_message);

  if(debug) {
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
  if(mention.for._id == chatGlobals.user._id) {
    document.querySelector('#mention-message').innerText = `${mention.by.alias} mentioned you.`
    document.querySelector('#mention-alert').classList.add('show');
  }
})

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

document.querySelector('#user-settings').setAttribute("data-toggle", "modal");
document.querySelector('#user-settings').setAttribute("data-target", "#edit-profile-modal");

document.querySelector('user-name').setAttribute("data-toggle", "modal");
document.querySelector('user-name').setAttribute("data-target", "#edit-profile-modal");

let chatMessages = [];

chatMessages.forEach(msg => {
  msg.render(document.querySelector('message-root'));
});

/////////////////////////////////////////////////////
/// CREATE PM
/////////////////////////////////////////////////////

let userSearch = new Search('user', document.querySelector('#create-pm-modal'));
let addToRoomModules = [];

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#create-pm-user-search').addEventListener('input', e => {
    let query = e.target.value;
    if(debug) console.log('Searched for: ' + query);
    userSearch.search(query);

    if(query == '') {
      let userList = document.querySelector('user-list');

      while(userList.firstChild) {
        userList.removeChild(userList.firstChild);
      }
    }
  });

  document.querySelector('#create-pm-modal').addEventListener('search-result', e => {
    let userList = document.querySelector('user-list');

    while(userList.firstChild) {
      userList.removeChild(userList.firstChild);
    }

    e.detail.forEach(user => {
      let item = new UserListItem(document.querySelector('user-list'), user);
      item.render();
    });
  });

  //Adds the user clicked on to list of users in new chat room
  document.querySelector('user-list').addEventListener('user-added', e => {
    if(!chatGlobals.addToRoom.some(user => user._id == e.detail._id)) {
      chatGlobals.addToRoom.push(e.detail);
      let addToRoom = new AddToChat(document.querySelector('users-to-add'), e.detail);
      addToRoomModules.push(addToRoom);
      addToRoom.render();
    } 
    if(debug) console.log(chatGlobals.addToRoom);
  })

  document.querySelector('users-to-add').addEventListener('user-removed', e => {
    chatGlobals.addToRoom = chatGlobals.addToRoom.filter(user => user._id != e.detail._id)
    if(debug) console.log(chatGlobals.addToRoom);
  })
})

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
}

function isSpace(char) {
    var space = new RegExp(/^\s$/);
    return space.test(char.charAt(0));
};

document.querySelector('#messageValue').addEventListener('input', () => {

  let msg = document.querySelector('#messageValue');

  if(!mentions.inMention) {
    mentions.clear();
  }

  if(msg.value.substr(msg.value.length -1 == '@') && (isSpace(msg.value.substr(msg.value.length -2)) || msg.value.length == 1) && !mentions.inMention) {
    mentions.start = msg.value.length;
    mentions.inMention = true;
    mentions.clear();
  }

  if(msg.value.charAt(mentions.start - 1) != '@' || (mentions.inMention && isSpace(msg.value.substr(msg.value.length -1)))) {
    mentions.inMention = false;
  }

  if(mentions.inMention) {
    mentions.query = msg.value.substr(mentions.start);
    document.querySelector('mentions-root').classList.remove('hidden')
    if(debug) console.log(mentions);
    if(debug) console.log(msg.value.charAt(mentions.start - 1));
    mentions.users.search(mentions.query);

    document.querySelector('overlay-root').classList.remove('hidden');
  }
})

document.querySelector('mentions-root').addEventListener('search-result', e => {
  if(debug) console.log(e.detail);
  document.querySelector('mentions-root').innerHTML = '';

  e.detail.forEach(user => {
    if(debug) console.log(user);
    let mentionsItem = new MentionsItem(document.querySelector('mentions-root'), user);
    mentionsItem.render();
  })
})

document.querySelector('mentions-root').addEventListener('mention-user', e => {
  mentions.inMention = false;
  let msg = document.querySelector('#messageValue');
  if(debug) console.log(e.detail);

  msg.value = msg.value.replace(`@${mentions.query}`, `@${e.detail.alias} `);

  mentions.inLatestMessage.push(e.detail);

  if(debug) console.log('Mentioned in message >');
  if(debug) console.log(mentions.inLatestMessage);

  msg.focus();
  mentions.clear();
})
