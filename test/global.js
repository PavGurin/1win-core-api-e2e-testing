import SocketClient from '../src';

let socket;

before(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.defaultCountry = 'ru';
  global.defaultPassword = '123123';
  global.defaultPartnerKey = 'test001';
  global.defaultVisitDomain = '1win.dev';
});

after(async () => {
  socket.disconnect();
});
