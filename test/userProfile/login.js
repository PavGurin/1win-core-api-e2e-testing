import { randomStr } from '../../src/randomizer';
import { checkErrorMsg } from '../../src/responseChecker';
import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';

describe('Login', () => {
  // (+) for positive tests (-) for negative tests

  it('C19293 (+) login by email', async () => {
    const { data } = await register.oneClickReg();
    const { status } = await userList.loginWithParams(data.email, data.password);
    // console.log(status);
    expect(status).toEqual(200);
  });

  it('C19294 (+) login by phone', async () => {
    const { data } = await register.oneClickReg();
    const { status } = await userList.loginWithParams(data.phone, data.password);
    // console.log(status);
    expect(status).toEqual(200);
  });

  it('C19295 (-) nonexistent user', async () => {
    const { data } = await userList.loginWithParams('nonexistent_user@yep.fail', '123123');
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });

  it('C19296 (-) wrong password', async () => {
    const { data: regResult } = await register.oneClickReg();
    const { data } = await userList.loginWithParams(regResult.email, 'wrongPass');
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });

  it('C19297 (-) empty login', async () => {
    const { data } = await userList.loginWithParams('', '123123');
    // console.log(data);
    checkErrorMsg(data, 'Bad request, login is invalid');
  });

  it('C19298 (-) empty password', async () => {
    const { data: regResult } = await register.oneClickReg();
    const { data } = await userList.loginWithParams(regResult.email, '');
    // console.log(data);
    checkErrorMsg(data, 'Bad request, password is invalid');
  });

  it('C19299 (-) long login (17 symbols)', async () => {
    const login = randomStr(17);
    const { data } = await userList.loginWithParams(login, '');
    // console.log(data);
    checkErrorMsg(data, 'Bad request, password is invalid');
  });

  it('C19300 (-) long password (19 symbols)', async () => {
    const { data: regResult } = await register.oneClickReg();
    const { data } = await userList.loginWithParams(regResult.email, randomStr(19));
    // console.log(data);
    checkErrorMsg(data, 'Неверный email или пароль');
  });
});
