const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const bodyParser = require("body-parser");
const request = require('request-promise');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const port = 5000;
const fileUpload = require('express-fileupload');


///////////////////////////////////////////////////
/// Routers
///////////////////////////////////////////////////

const registerRouter = require('./app_routes/register');
const userRouter = require('./app_routes/user');
const searchRouter = require('./app_routes/search');
const chatRouter = require('./app_routes/chat');
const loginRouter = require('./app_routes/login');
const loginfailedRouter = require('./app_routes/loginfailed');
const chatroomRouter = require('./app_routes/chatroom');
const uploadFile = require('./app_routes/uploadfile');

///////////////////////////////////////////////////
/// MIDDLEWARES
///////////////////////////////////////////////////

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
// //Enable files upload
// app.use(fileUpload({
//   createParentPath: true
// }));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

///////////////////////////////////////////////////
/// ROUTES
///////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.render('index.ejs', { loginfailed: false });
});

app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/chat', chatRouter);
app.use('/login', loginRouter);
app.use('/loginfailed', loginfailedRouter);
app.use('/chatroom', chatroomRouter);
app.use('/uploadfile', uploadFile);

///////////////////////////////////////////////////
/// SOCKET.IO
///////////////////////////////////////////////////

io.on('connection', (socket) => {
  socket.on('newUser', (user) => {
    socket.username = user;

    //New user is online
    socket.broadcast.emit('newUser', `${user}: Is now online!`);

    //You are online
    socket.on('userOnline', (user) => {
      socket.emit('userOnline', `You ${user} are online`);
    });

    // is Typing
    socket.on('typing', (isTyping) => {
      socket.broadcast.emit('updateTyping', user, isTyping);
    });
  });

  socket.on('chat message', function (chatMessage) {  //Lyssnar på eventet 'chat message'
    console.log(chatMessage);
    request('http://127.0.0.1:3000/chatroom/', {       //POST request to server.js containing message
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: chatMessage,                              //Message body
    }).then(message => {                              //recieves message + id from server
      console.log('Chat message recieved:' + JSON.parse(message));
      io.emit('chat message', JSON.parse(message));   //Emits chat message to all clients
    }).catch(error => {
      console.error(error);
    });
  });

  socket.on('edit', function (chatMessage) {          //Lyssnar på eventet 'chat message'
    request('http://127.0.0.1:3000/chatroom/edit', {       //PUT request to server.js containing message
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatMessage),                              //Message body
    }).then(message => {                              //recieves message + id from server
      console.log('Chat message edited >');
      console.log(message);
      io.emit('edit', JSON.parse(message));           //Emits chat message to all clients
    });
  });

  socket.on('delete', function (chatMessage) {          //Lyssnar på eventet 'chat message'
    request('http://127.0.0.1:3000/chatroom', {       //PUT request to server.js containing message
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatMessage),                       //Message body
    }).then(message => {                              //recieves message + id from server
      console.log('Chat message deleted:' + message);
      //The server recieves a JSON string object and sends it further to all clients connected to the socket.
      io.emit('delete', JSON.parse(message));           //Emits chat message to all clients
    });
  });

  socket.on('disconnect', (user) => {
    socket.broadcast.emit('newUser', socket.username + ' Disconnected')
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});
