import {
  ChatModule
} from "./chat-module.js";

////////////////////////////////////////////////
//Globals
////////////////////////////////////////////////
let chatGlobals = {
  deleteTarget: undefined,
  editTarget: undefined
}

console.log(document.cookie);

var socket = io();

////////////////////////////////////////////////
//CRUD-events
////////////////////////////////////////////////

//Delete events
document.addEventListener('delete-init', e => {
  chatGlobals.deleteTarget = e.detail;
})

document.querySelector('#delete-btn').addEventListener('click', () => {
  chatGlobals.deleteTarget.dispatchEvent(new CustomEvent('delete-confirm', {}));
});

//Edit Events
document.addEventListener('edit-init', e => {
  chatGlobals.editTarget = e.detail;
  document.querySelector('#edit-message').value = chatGlobals.editTarget.textContent;
})

document.querySelector('#edit-btn').addEventListener('click', () => {
  chatGlobals.editTarget.parentNode.dispatchEvent(new CustomEvent('edit-confirm', {
    detail: document.querySelector('#edit-message')
  }));
});

$("form").submit(function (e) {
  e.preventDefault();
  if ($("#messageValue").val() == "") { } else {
    let chatMessage = new ChatModule(
      $("#messageValue").val(),
      "User_name",
      'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
      getTodaysDate()
    );
    //Emits the stringified chatMessage object to server.
    socket.emit("chat message", JSON.stringify(chatMessage));

    $("#messageValue").val('');
  }
});

////////////////////////////////////////////////
//SOCKETS
////////////////////////////////////////////////

//Renders incoming chat messages
socket.on('chat message', function (chatObject) {
  chatObject = JSON.parse(chatObject);

  //Loads in the now parsed chatobject and loads it's content into chatmessageModel
  let chatmessageModel = new ChatModule(
    chatObject.content,
    chatObject.alias,
    'https://icon-library.net/images/icon-for-user/icon-for-user-8.jpg',
    chatObject.datetime,
    chatObject._id
  );

  console.log(chatmessageModel);

  chatMessages.push(chatmessageModel);
  chatmessageModel.render(document.querySelector('message-root'));
});


//Loopa igenom alla chatmeddelanden, kontrollera id och rendera ut det nya editerade meddelandet.
socket.on('edit', edited_message => {
  chatMessages.forEach(message => {
    if (message._id == edited_message._id) {
      message.edit(edited_message.text, false);
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

let chatMessages = [
  new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Fabian Johansson',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/74617601_2692609500763768_5275050151155597312_o.jpg?_nc_cat=103&_nc_ohc=XBoYWDubAUUAQmTc4DVWQe_05mCnZ0CL3rXU91R8LK5tH670PwiZwEaog&_nc_ht=scontent-arn2-1.xx&oh=d53991ce63884e4faa86b246edbff50b&oe=5E7797AA',
    '11:26'
  ),
  new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Bryan Santamaria',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t31.0-8/13580553_10153540477521470_8547081405158753156_o.jpg?_nc_cat=111&_nc_ohc=w1OeQC-JqpUAQnyq8OfuNAvLuI8YrDBMTmZkQo4vtQl-uAZIjfdGDN2lw&_nc_ht=scontent-arn2-1.xx&oh=20045fa1123f617259ecb2a4d768ad27&oe=5E83EB6D',
    '11:26'
  ),
  new ChatModule(
    'Aliquam elit eros, suscipit quis semper eget, consectetur eget nisi. Donec consectetur quis nibh eget viverra. Aenean pulvinar mollis arcu, porta faucibus nibh pellentesque sit amet. Ut non tristique lorem, ut maximus mi. Quisque iaculis elit sed risus ultrices, blandit iaculis neque scelerisque.',
    'Alexander Wilson',
    'https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/51721821_10156909845079030_3534192012213354496_n.jpg?_nc_cat=109&_nc_ohc=CabSkySieYMAQlIvjyAJrkabzdmPpbzrfdZN9QL78W5gjN_cxQuE_-7Qg&_nc_ht=scontent-arn2-1.xx&oh=d57a7ebc3db7466ef4e5ec2822247038&oe=5E830A5E',
    '11:26'
  )

];

chatMessages.forEach(msg => {
  msg.render(document.querySelector('message-root'));
});


