import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Message } from './models/Message.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server for Express and Socket.io
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notes', noteRoutes);

// Conversation history between two users
app.get('/api/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kite Social Platform API with Real-Time WebSockets',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('Kite Social Platform API is live. Health check at /api/health');
});

// ==========================================
// REAL-TIME MESSAGING WITH SOCKET.IO
// ==========================================
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Map of userId -> socketId and socketId -> userId
const userSockets = new Map();
const socketUsers = new Map();

io.on('connection', (socket) => {
  // User connects & registers their identity
  socket.on('join', (userId) => {
    if (!userId) return;
    userSockets.set(userId, socket.id);
    socketUsers.set(socket.id, userId);

    // Broadcast updated online presence to all connected clients
    io.emit('online_users', Array.from(userSockets.keys()));
  });

  // Sending a chat message in real time
  socket.on('send_message', async (data) => {
    try {
      const { senderId, receiverId, text, time, senderName, senderAvatar } = data;
      if (!senderId || !receiverId || !text) return;

      // Save to MongoDB Message collection
      let savedMsg;
      try {
        savedMsg = await Message.create({
          senderId,
          receiverId,
          text: text.trim(),
        });
      } catch (dbErr) {
        console.warn('Could not persist message to MongoDB:', dbErr.message);
      }

      const payload = {
        id: savedMsg?._id?.toString() || data.id || `msg-${Date.now()}`,
        senderId,
        receiverId,
        text: text.trim(),
        time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName,
        senderAvatar,
        createdAt: new Date(),
      };

      // Deliver to recipient socket if online
      const recipientSocketId = userSockets.get(receiverId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', payload);
      }

      // Acknowledge back to sender
      socket.emit('message_sent', payload);
    } catch (err) {
      console.error('Socket send_message error:', err.message);
    }
  });

  // Real-time typing indicators
  socket.on('typing', ({ senderId, receiverId, isTyping }) => {
    const recipientSocketId = userSockets.get(receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { senderId, isTyping });
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    const userId = socketUsers.get(socket.id);
    if (userId) {
      userSockets.delete(userId);
      socketUsers.delete(socket.id);
      io.emit('online_users', Array.from(userSockets.keys()));
    }
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Kite Server running on port ${PORT} with real-time Socket.io enabled`);
});
