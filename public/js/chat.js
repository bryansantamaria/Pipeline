import {
  ChatModule
} from "./chat-module.js";


//Exempelkod för fetchning och rendering av chattrum XD
/*class ChatRoom {
  constructor(id, type, name) {
    this.name = name;
    this.id = id;
    this.type = type;
  }

  render() {
    document.querySelector('private-message').innerHTML += `
    <div id=${this.id}><i class="fas fa-circle"></i> ${this.name}</div>
    `;

    document.querySelector('#' + this.id).addEventListener('click', ()=> {
      fetch('/chatroom/' + this.id).then(res => {
        return res.json()
      }
      ). then(msg => {
        //rendera meddelandet
      });
    })
  }
}
//Fetchar alla chatrum
fetch('/chatroom').then(res => {
  return res.json();
}).then(chatrooms => {
  chatrooms = JSON.parse(chatrooms);

  chatrooms.forEach(room => {
    let currentRoom = new ChatRoom(
      room.id,
      room.type,
      room.name
    );

    currentRoom.render();
  })
})*/

////////////////////////////////////////////////
//Globals
////////////////////////////////////////////////
let chatGlobals = {
  deleteTarget: undefined,
  editTarget: undefined,
  user: undefined,
  chatroomId: 'dab123'
}

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
})

fetch('/chatroom/General').then(res => {
  return res.json();
}).then(chatroom => {
  chatroom = JSON.parse(chatroom);

  console.log(chatroom[0]);

  chatroom.forEach(msg => {
    let chatModule = new ChatModule(
      msg.message,
      msg.alias,
      'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
      msg.timestamp,
      msg._id
    )
    chatModule.render(document.querySelector('message-root'))
  })
})

var socket = io();

function updateUser() {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;


  //TODO: SERVERSIDE MADDAFAKKA
  fetch('http://127.0.0.1:3000/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chatGlobals.user),
  })
}

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

$("form").submit(function (e) {
  e.preventDefault();
  if ($("#messageValue").val() == "") { } else {
    let chatMessage = {
      alias: chatGlobals.user.alias,
      message: $("#messageValue").val(),
      avatar: 'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
      timestamp: getTodaysDate(),
      chatroom: chatGlobals.chatroomId
    }

    console.log(chatMessage);
    //Emits the stringified chatMessage object to server.
    socket.emit("chat message", JSON.stringify(chatMessage));

    $("#messageValue").val('');
  }
});

document.querySelector('#update-profile-btn').addEventListener('click', () => {
  chatGlobals.user.alias = html.edit_alias.value;
  html.alias.innerText = chatGlobals.user.alias;

  //TODO: SERVERSIDE MADDAFAKKA
  fetch('http://127.0.0.1:5000/user/edit/' + uid, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(chatGlobals.user),
  })
});

////////////////////////////////////////////////
//SOCKETS
////////////////////////////////////////////////

//Renders incoming chat messages
socket.on('chat message', function (chatObject) {
  chatObject = JSON.parse(chatObject);

  console.log('Message recieved from server');
  console.log(chatObject);

  //Loads in the now parsed chatobject and loads it's content into chatmessageModel
  let chatMessage = new ChatModule(
    chatObject.content,
    chatObject.alias,
    'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
    chatObject.timestamp,
    chatObject._id
  );

  console.log(chatMessage);

  chatMessages.push(chatMessage);
  chatMessage.render(document.querySelector('message-root'));
});


//Loopa igenom alla chatmeddelanden, kontrollera id och rendera ut det nya editerade meddelandet.
socket.on('edit', edited_message => {
  edited_message = JSON.parse(edited_message);
  console.log('Edit from server >')
  console.log(edited_message);
  chatMessages.forEach(message => {
    if (message._id == edited_message._id) {
      message.edit(edited_message.message, false);
    }
  });
});

//Loopa igenom alla chatmeddelanden, kontrollera id och radera meddelandet.
socket.on('delete', delete_message => {
  delete_message = JSON.parse(delete_message);
  console.log(delete_message);

  chatMessages.forEach(message => {
    if (message.content._id == delete_message._id) {
      message.delete();
    }
  });
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
document.querySelector('#private-message-title').setAttribute("data-toggle", "modal")
document.querySelector('#private-message-title').setAttribute("data-target", "#create-pm-modal")

document.querySelector('#user-settings').setAttribute("data-toggle", "modal")
document.querySelector('#user-settings').setAttribute("data-target", "#edit-profile-modal")

document.querySelector('user-name').setAttribute("data-toggle", "modal")
document.querySelector('user-name').setAttribute("data-target", "#edit-profile-modal")

let chatMessages = [];

chatMessages.forEach(msg => {
  msg.render(document.querySelector('message-root'));
});
