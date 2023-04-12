
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Add this line
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Allow any origin to connect for now
    methods: ['GET', 'POST'],
  },
});
const port = 3001;

app.use(cors()); // Add this line
app.use(express.json());
app.use(express.static('public'));

app.post('/send', (req, res) => {
  console.log('Received message:', req.body.message);
  io.emit('newMessage', req.body.message);
  res.send('Message received.');
});

io.on('connection', (socket) => {
  console.log('A user connected');
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = (req, res) => {
  if (req.method === 'POST') {
    // Handle POST request from the C program
    console.log('Received message:', req.body.message);
    io.emit('newMessage', req.body.message);
    res.send('Message received.');
  } else {
    // Handle other requests
    res.status(405).send('Method Not Allowed');
  }
};




/*
const { Server } = require('socket.io');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = new Server(server);



app.use(express.json());

io.on('connection', (socket) => {
  console.log('A user connected');
});

app.post('/send', (req, res) => {
  console.log('Received message:', req.body.message);
  io.emit('newMessage', req.body.message);
  res.send('Message received.');
});

module.exports = (req, res) => {
  if (req.method === 'POST') {
    // Handle POST request from the C program
    app(req, res);
  } else {
    // Handle other requests
    res.status(405).send('Method Not Allowed');
  }
};
*/