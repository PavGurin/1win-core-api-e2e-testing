/**
 * @jest-environment node
 */


import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { checkMailRequisites } from '../../src/expects/exMail';
import { checkSuccess } from '../../src/responseChecker';
import { userPool } from '../../src/methods/userPool';


describe('Withdrawal with confirmation codes', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 120;
  let receivedMail = {};
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await banking.withdrawalCreate('5469550073662048', 'card_rub', 'RUB', 100);
  });

  // скип, т.к на стейдже не отправляются письма
  it.skip('C27123 (+) Balance checking after successful withdrawal', async () => {
    // задержка для получения письма
    await sleep(4000);
    receivedMail = await mail.getMessage(currentUser.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение вывода', 'Confirmation - 1Win', 'confirmation@fbet.top');

    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // проверка баланса после вывода
    expect(await banking.balanceCheck()).toEqual(currentUser.balance - 100);
  });

  it('C27201 (-) Balance checking after not successful withdrawal', async () => {
    // задержка для получения письма
    // await sleep(4000);
    // receivedMail = await mail.getMessage(currentUser.email);
    // checkMailRequisites(receivedMail, '1Win - Подтверждение вывода', 'Confirmation - 1Win',
    // 'confirmation@fbet.top');

    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: 1111111 });
    // console.log(confirmData);
    expect(confirm.data.status).toEqual(400);

    // проверка баланса после вывода
    expect(await banking.balanceCheck()).toEqual(currentUser.balance);
  });
});
