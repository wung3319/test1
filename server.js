const express = require('express');
const https = require('https');
const serveStatic = require('serve-static');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const options = {
  key: fs.readFileSync('private.pem'),
  cert: fs.readFileSync('public.pem'),
};

const server = https.createServer(options, app);
const io = socketIO(server);
app.use(serveStatic(path.join(__dirname, 'dist')));

// WebRTC 신호 처리를 위한 소켓 이벤트
io.on('connection', (socket) => {
  console.log('a user connected');

  // WebRTC offer를 받았을 때 처리
  socket.on('webrtc_offer', (offer) => {
    console.log('Received WebRTC offer');
    socket.broadcast.emit('webrtc_offer', offer);
  });

  // WebRTC answer를 받았을 때 처리
  socket.on('webrtc_answer', (answer) => {
    console.log('Received WebRTC answer');
    socket.broadcast.emit('webrtc_answer', answer);
  });

  // ICE candidate를 받았을 때 처리
  socket.on('webrtc_ice_candidate', (candidate) => {
    console.log('Received ICE candidate');
    socket.broadcast.emit('webrtc_ice_candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000 with HTTPS');
});
