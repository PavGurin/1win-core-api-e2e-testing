// import jest from 'jest';
import SocketClient from '../src/index';

export const getNewSocket = async () => {
  const socket = new SocketClient({});
  await socket.connect();
  return socket;
};

let socket;

beforeAll(async () => {
  socket = new SocketClient({});
  await socket.connect();
  global.socket = socket;
  global.defaultCountry = 'ru';
  global.defaultPassword = '123123';
  global.defaultPartnerKey = 'test001';
  global.defaultVisitDomain = '1win.dev';
  global.transferExpirationTime = process.env.TRANSFER_EXPIRATION_TIME || 30000;
  jest.setTimeout(40000);
});

afterAll(async () => {
  socket.disconnect();
});
