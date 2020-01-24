import { checkErrorMsg, checkSuccess } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { mail } from '../../src/methods/mail';
import { sleep } from '../../src/methods/utils';
import { checkMailRequisites } from '../../src/expects/exMail';
import { forgotConfirm, forgotRecovery } from '../../src/methods/user';

describe('Conformation methods for user data recovery', () => {
  it('C19316 (+) with correct code', async () => {
    const user = await register.regMailWithConfirmationCodes();
    const sentReq = await forgotRecovery(user.data.email);

    await sleep(4000);
    const receivedMail = await mail.getMessage(user.data.email);
    checkMailRequisites(receivedMail, '1Win - Password recovery', 'Forgot Password - 1Win', 'staging@fastmail.com');
    const confirmReq = await forgotConfirm(sentReq.data.userId, receivedMail.code,
      defaultPassword, defaultPassword);
    // console.log(confirmReq);
    checkSuccess(confirmReq);
  });

  // register > ask for recovery > try to confirm > check
  it('C19317 (-) with incorrect code', async () => {
    const { data: regData } = await register.oneClickReg();
    // console.log(regData);
    await forgotRecovery(regData.email);
    const { data: confirmReq } = await forgotConfirm(regData.id, 1234567,
      defaultPassword, defaultPassword);
    // console.log(confirmReq);
    checkErrorMsg(confirmReq, 'Неверный ключ запроса');
  });
});
