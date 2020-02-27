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


describe('Balance checking', () => {
  let balanceBefore;
  const USERS_NUMBER = 1;
  const BALANCE = 120;
  let receivedMail = {};
  let currentUser = {};
  let users = [];
  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
    // проверка баланса у пользователя, которому будет перевод, до перевода
    await userList.loginTransferToUser();
    balanceBefore = await banking.balanceCheck();

    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await banking.transferCreate(20, 'RUB');
    // задержка, чтобы письмо успело придти на почту
    await sleep(4000);
    receivedMail = await mail.getMessage(currentUser.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение перевода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });

  it('C21440 (+) after successful transfer', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // проверка баланса у пользователя, который делал перевод, после перевода
    expect(await banking.balanceCheck()).toEqual(currentUser.balance - 20);

    // проверка баланса у пользователя, которому был перевод, после перевода
    await userList.loginTransferToUser();
    expect(await banking.balanceCheck()).toEqual(balanceBefore + 20);
  });

  it('C27200 (-) after not successful transfer', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code + 1 });
    expect(confirm.status).toEqual(200);
    expect(confirm.data.status).toEqual(400);

    // проверка баланса у пользователя, который делал перевод, после перевода
    expect(await banking.balanceCheck()).toEqual(currentUser.balance);

    // проверка баланса у пользователя, которому был перевод, после перевода
    await userList.loginTransferToUser();
    expect(await banking.balanceCheck()).toEqual(balanceBefore);
  });
});
