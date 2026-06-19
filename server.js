const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let db = { players: [], fixtures: [], liveMatch: null, news: [], standings: {} };

if (fs.existsSync('db.json')) {
  db = JSON.parse(fs.readFileSync('db.json'));
}

app.use(express.static('public'));
app.use(express.json());

io.on('connection', (socket) => {
  console.log('User connected');
  socket.emit('dbUpdate', db);

  socket.on('adminUpdate', (newData) => {
    db = { ...db, ...newData };
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    io.emit('dbUpdate', db); // Broadcast to ALL users
  });
});

server.listen(3000, () => console.log('🚀 Elite League Server running on http://localhost:3000'));