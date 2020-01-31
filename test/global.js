import SocketClient from '../src/index';

let socket;

beforeEach(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.defaultCountry = 'ru';
  global.defaultPassword = '123123';
  global.defaultPartnerKey = 'test001';
  global.defaultVisitDomain = '1win.dev';
  global.transferExpirationTime = process.env.TRANSFER_EXPIRATION_TIME || 30000;
  jest.setTimeout(65000);
});

afterEach(async () => {
  socket.disconnect();
});
