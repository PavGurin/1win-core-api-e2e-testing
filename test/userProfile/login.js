import { expect } from 'chai';
import { randomStr } from '../../src/randomizer';
import { checkErrorMsg } from '../../src/responseChecker';
import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';
import { getNewSocket } from '../global';

describe('Login', () => {
  // (+) for positive tests (-) for negative tests
  let socket;
  const tg_hash = randomStr(5);

  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(() => socket.disconnect());

  it('C19293 (+) login by email', async () => {
    const { data } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, data.email, data.password);
    // console.log(status);
    expect(status).equal(200);
  });

  it('C19294 (+) login by phone', async () => {
    const { data } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, data.phone, data.password);
    // console.log(status);
    expect(status).equal(200);
  });

  it('C19295 (-) nonexistent user', async () => {
    const { data } = await userList.loginWithParams(socket, 'nonexistent_user@yep.fail', '123123', tg_hash);
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });

  it('C19296 (-) wrong password', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { data } = await userList.loginWithParams(socket, regResult.email, 'wrongPass');
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });

  it('C19297 (-) empty login', async () => {
    const { data } = await userList.loginWithParams(socket, '', '123123', tg_hash);
    // console.log(data);
    checkErrorMsg(data, 'Bad request, login is invalid');
  });

  it('C19298 (-) empty password', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { data } = await userList.loginWithParams(socket, regResult.email, '');
    // console.log(data);
    checkErrorMsg(data, 'Bad request, password is invalid');
  });

  it('C19299 (-) long login (17 symbols)', async () => {
    const login = randomStr(17);
    const { data } = await userList.loginWithParams(socket, login, '', tg_hash);
    // console.log(data);
    checkErrorMsg(data, 'Bad request, password is invalid');
  });

  it('C19300 (-) long password (19 symbols)', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { data } = await userList.loginWithParams(socket, regResult.email, randomStr(19));
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });

  it('C19926 (+) short tg_hash (4 symbols)', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, regResult.email, randomStr(19),
      randomStr(4));
    // console.log(data);
    expect(status).equal(200);
  });

  it('C19927 (+) long tg_hash (6 symbols)', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, regResult.email, randomStr(19),
      randomStr(6));
    // console.log(data);
    // console.log(data);
    expect(status).equal(200);
  });

  it('C19928 (+) empty tg_hash', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, regResult.email, randomStr(19), null);
    // console.log(data);
    // console.log(data);
    expect(status).equal(200);
  });

  it('C19929 (+) w/o tg_hash', async () => {
    const { data: regResult } = await register.oneClickReg(socket);
    const { status } = await userList.loginWithParams(socket, regResult.email, randomStr(19));
    // console.log(data);
    // console.log(data);
    expect(status).equal(200);
  });
});
