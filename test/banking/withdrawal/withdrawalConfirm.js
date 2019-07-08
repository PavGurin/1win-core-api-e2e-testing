import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';
import { mail } from '../../../src/methods/mail';
import { sleep } from '../../../src/methods/utils';

describe('Withdrawal confirm', () => {
  it('C19338 (-) Incorrect code code response 403', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 10704 });
    // console.log(data);
    checkErrMsg(data, 403, 'Выплата не найдена');
  });

  it('C19339 (-) Incorrect code response 400', async () => {
    await userList.loginWithRealMoney();
    await banking.withdrawalCreate(100, '1111222200003333',
      'card_rub', 'RUB');
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 99 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });

  it.skip('C27036 (+) Correct code', async () => {
    const loginData = await userList.loginWithMailConfirmationCodes();
    await banking.withdrawalCreate(100, '5469550073662048',
      'card_rub', 'RUB');

    // задержка для получения письма
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение вывода');
    const confirmData = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.id).to.exist;
  });
});
