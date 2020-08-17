import { checkErrMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { forgotRecovery } from '../../src/methods/user';
import { checkSuccessRecovery } from '../../src/expects/exUser';

describe('Recovery user data by different methods', () => {
  it('C19318 (+) recovery by email', async () => {
    const { data: regData } = await register.oneClickReg();
    // console.log(regData);
    const { data: recoveryReq } = await forgotRecovery(regData.email);
    // console.log(recoveryReq);
    checkSuccessRecovery(regData, recoveryReq);
  });

  it('C19319 (+) recovery by phone', async () => {
    const { data: regData } = await register.oneClickReg();
    // console.log(regData);
    const { data: recoveryReq } = await forgotRecovery(regData.phone);
    // console.log(recoveryReq);
    checkSuccessRecovery(regData, recoveryReq);
  });

  // maybe error message will be changed
  it('C19320 (-) nonexistent user', async () => {
    const { data } = await forgotRecovery('nonexistent_user');

    // console.log(data);
    checkErrMsg(data, 400, 'Пользователь не существует');
  });

  it('C19321 (-) empty account field', async () => {
    const { data } = await forgotRecovery('');

    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, account is invalid');
  });
});
