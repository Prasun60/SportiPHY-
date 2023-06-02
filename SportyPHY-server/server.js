const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const Message = require('./models/message');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

// export const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_APT_SECRET,
// });

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: '*',
    // credentials: true,
  },
});

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';
io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    console.log(data.body + ' from frontend');
    console.log(data.senderId + ' from frontend');
    await Message.create({
      messages: data.body,
      senderId: data.senderId,
      roomId: data.roomId,
      name: data.name,
    });
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection, shutting down server ! ');
  server.close(() => {
    process.exit(1);
  });
});
