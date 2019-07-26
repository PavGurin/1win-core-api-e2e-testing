// import jest from 'jest';
import SocketClient from '../src/index';

let socket;

beforeAll(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.defaultCountry = 'ru';
  global.defaultPassword = '123123';
  global.defaultPartnerKey = 'test001';
  global.defaultVisitDomain = '1win.dev';
  jest.setTimeout(10000);
});

afterAll(async () => {
  socket.disconnect();
});
