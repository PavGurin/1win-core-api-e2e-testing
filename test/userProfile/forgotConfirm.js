import { checkErrorMsg, checkSuccess } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { mail } from '../../src/methods/mail';
import { sleep } from '../../src/methods/utils';
import { checkMailRequisites } from '../../src/expects/exMail';

describe('Auth recovery confirm', () => {
  it('C19316 (+) with correct code', async () => {
    const user = await register.regMailWithConfirmationCodes();
    const sentReq = await socket.send('USER:forgot-recovery', {
      account: user.data.email,
    });
    await sleep(4000);
    const receivedMail = await mail.getMessage(user.data.email);
    checkMailRequisites(receivedMail, '1Win - Password recovery', 'Forgot Password - 1Win', 'confirmation@fbet.top');
    const confirmReq = await socket.send('USER:forgot-confirm', {
      userId: sentReq.data.userId,
      code: receivedMail.code,
      password: defaultPassword,
      repeat_password: defaultPassword,
    });
    checkSuccess(confirmReq);
  });

  // register > ask for recovery > try to confirm > check
  it('C19317 (-) with incorrect code', async () => {
    const { data: regData } = await register.oneClickReg();
    // console.log(regData);

    await socket.send('USER:forgot-recovery', {
      account: regData.email,
    });

    const { data: confirmReq } = await socket.send('USER:forgot-confirm', {
      userId: regData.id,
      code: 1234567,
      password: defaultPassword,
      repeat_password: defaultPassword,
    });
    // console.log(confirmReq);
    checkErrorMsg(confirmReq, 'Неверный ключ запроса');
  });
});
