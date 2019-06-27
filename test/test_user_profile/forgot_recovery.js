import { expect } from 'chai';
import { checkErrorMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';

describe('Auth recovery forgot', () => {
  function checkSuccess(regData, recoveryReq) {
    expect(recoveryReq).to.be.an('object');
    expect(recoveryReq.userId).equal(regData.id);
    expect(recoveryReq.email).satisfies(email => email.startsWith(regData.email.substr(0, 2)))
      .and.satisfies(email => email.endsWith(regData.email.substr(5)));
  }

  it('C19318 (+) recovery by email', async () => {
    const { data: regData } = await register.one_click_reg();
    // console.log(regData);

    const { data: recoveryReq } = await socket.send('USER:forgot-recovery', {
      account: regData.email,
    });
    // console.log(recoveryReq);
    checkSuccess(regData, recoveryReq);
  });

  it('C19319 (+) recovery by phone', async () => {
    const { data: regData } = await register.one_click_reg();
    // console.log(regData);

    const { data: recoveryReq } = await socket.send('USER:forgot-recovery', {
      account: regData.phone,
    });
    // console.log(recoveryReq);
    checkSuccess(regData, recoveryReq);
  });

  // maybe error message will be changed
  it('C19320 (-) nonexistent user', async () => {
    const { data } = await socket.send('USER:forgot-recovery', {
      account: 'nonexistent_user',
    });
    // console.log(data);
    checkErrorMsg(data, 'Пользователь не существует');
  });

  it('C19321 (-) empty account field', async () => {
    const { data } = await socket.send('USER:forgot-recovery', {
      account: '',
    });
    // console.log(data);
    checkErrorMsg(data, 'Bad request, account is invalid');
  });
});
