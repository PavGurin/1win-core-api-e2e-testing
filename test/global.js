import SocketClient from '../src';

let socket;

before(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.default_country = 'ru';
  global.default_password = '123123';
});

after(async () => {
  socket.disconnect();
});
