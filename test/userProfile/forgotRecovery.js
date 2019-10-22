import { checkErrorMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { forgotRecovery } from '../../src/methods/user';
import { checkSuccessRecovery } from '../../src/expects/exUser';
import { getNewSocket } from '../global';

describe('Auth recovery forgot', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(() => socket.disconnect());

  it('C19318 (+) recovery by email', async () => {
    const { data: regData } = await register.oneClickReg(socket);
    // console.log(regData);
    const { data: recoveryReq } = await forgotRecovery(socket, regData.email);
    // console.log(recoveryReq);
    checkSuccessRecovery(regData, recoveryReq);
  });

  it('C19319 (+) recovery by phone', async () => {
    const { data: regData } = await register.oneClickReg(socket);
    // console.log(regData);
    const { data: recoveryReq } = await forgotRecovery(socket, regData.phone);
    // console.log(recoveryReq);
    checkSuccessRecovery(regData, recoveryReq);
  });

  // maybe error message will be changed
  it('C19320 (-) nonexistent user', async () => {
    const { data } = await forgotRecovery(socket, 'nonexistent_user');

    // console.log(data);
    checkErrorMsg(data, 'Пользователь не существует');
  });

  it('C19321 (-) empty account field', async () => {
    const { data } = await forgotRecovery(socket, '');

    // console.log(data);
    checkErrorMsg(data, 'Bad request, account is invalid');
  });
});
