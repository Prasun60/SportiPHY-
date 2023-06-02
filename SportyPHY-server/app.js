const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');
const authRouter = require('./routes/authRoute');
const groupRouter = require('./routes/groupRoutes');
const messageRouter = require('./routes/messages');
const paymentRoute = require('./routes/paymentRoute.js');
const addItem = require('./routes/itemRoute');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
let cors = require('cors');

const morgan = require('morgan');
const express = require('express');
const app = express();
// app.use(
//   cors({
//     origin: 'https://sporty-phy-client.vercel.app/',
//   })
// );
app.use(
  cors({
    origin: '*',
  })
);
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// const http = require('http');

// const server=http.createServer(app);

// const io=socketIO(server);

// io.on('connection', () => {
//     console.log('a user connected');
// });

app.get('/', (req, res) => {
  res.send('The server is up and running .....');
});
app.use('/api/auth/', authRouter);
app.use('/api/users/', userRouter);
app.use('/api/posts/', postRouter);
app.use('/api/groups/', groupRouter);
app.use('/api/messages/', messageRouter);
app.use('/api/items/', addItem);
app.use('/api/razorpay', paymentRoute);

module.exports = app;
