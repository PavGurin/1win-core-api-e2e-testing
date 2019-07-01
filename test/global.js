import SocketClient from '../src';

let socket;

before(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.defaultCountry = 'ru';
  global.defaultPassword = '123123';
});

after(async () => {
  socket.disconnect();
});
