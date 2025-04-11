const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// Add a route handler for GET requests to the root path
app.get('/', (req, res) => {
  res.send('Server is running!'); // Send a response to the client
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

// API endpoint to trigger location services
app.post('/trigger-location', (req, res) => {
  io.emit('start-location-tracking'); // Broadcast signal to all clients
  res.status(200).send('Signal sent to all connected devices');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('location-update', (data) => {
    console.log('Location update from', socket.id, ':', data);
    // You can store or process the location data here
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

