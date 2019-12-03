const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    app.render('index.ejs');
});

io.on('connection', (socket) => {
    socket.on('newUser', (user) => {
        socket.username = user;
        console.log(user + ' connected');

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
    socket.on('chat message', function (msg) { //Lyssnar på eventet 'chat message'
        socket.broadcast.emit('chat message', socket.username + ": " + msg); //Servern tar emot det vi skrivit in och skriver ut vad användaren har skrivit.

    });
    socket.on('disconnect', (user) => {
        socket.broadcast.emit('newUser', socket.username + ' Disconnected')
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});