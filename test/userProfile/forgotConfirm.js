import { expect } from 'chai';
import { checkErrorMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import { mail } from '../../src/methods/mail';
import { sleep } from '../../src/methods/utils';

describe('Auth recovery confirm', () => {
  it('C19316 (+) with correct code', async () => {
    const mailAddress = 'confirmation_codes_user@dayloo.com';
    const sentReq = await socket.send('USER:forgot-recovery', {
      account: mailAddress,
    });
    // console.log(sentReq);

    // нужна задержка, т.к. письмо на почту приходит не сразу
    // без задержки запрос на получение кода из письма будет отправлен
    // слишком быстро, пока письма еще нет в почте
    await sleep(4000);

    const receivedMail = await mail.getMessage(mailAddress);
    // console.log(receivedMail);
    expect(receivedMail.subject).to.equal('1Win - Password recovery');

    const confirmReq = await socket.send('USER:forgot-confirm', {
      userId: sentReq.data.userId,
      code: receivedMail.code,
      password: defaultPassword,
      repeat_password: defaultPassword,
    });
    // console.log(confirmReq);

    expect(confirmReq.data.error).to.equal(false);
    expect(confirmReq.status).to.equal(200);
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
