/**
 * @jest-environment node
 */


import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { checkMailRequisites } from '../../../src/expects/exMail';
import { checkErrMsg, checkSuccess } from '../../../src/responseChecker';
import { userPool } from '../../../src/methods/userPool';

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
    await banking.withdrawalCreate('4553317749839107', 'card_rub', 'RUB', 100);
    // задержка для получения письма
    await sleep(10000);
    receivedMail = await mail.getMessage(currentUser.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение вывода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });

  it('C27036 (+) Correct code', async () => {
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);
  });

  it('C27120 (-) Active code of other user', async () => {
    currentUser = (await userPool.usersWithBalanceRubAndConfirmCodes(1, BALANCE)).pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await banking.withdrawalCreate('4630308028175088', 'card_rub', 'RUB', 100);
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirm);
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it.skip('C27121 (-) Expired code', async () => {
    // пока падает по таймауту
    // надо ждать 5 минут (300 000 мс), а у нас в настройках задан таймаут 10000 мс
    // Error: Timeout of 10000ms exceeded.

    // задержка в 5 минут, чтобы код протух
    await sleep(300000);
    const confirmData = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).toEqual(200);
    // checkErrMsg(confirmData.data, 404, 'Выплата не найдена');
  });

  it('C27122 (-) Second confirmation with the same code', async () => {
    // первое подтверждение
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // второе подтверждение
    const confirm2 = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData2);
    expect(confirm2.status).toEqual(200);
    checkErrMsg(confirm2.data, 403, 'Выплата не найдена');
  });

  it('C27220 (-) Active code of other operation that was obtained after withdrawal code', async () => {
    await banking.transferCreate(20, 'RUB');
    await sleep(10000);
    const transferMail = await mail.getMessage(currentUser.email);
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: transferMail.code });
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C27221 (-) Active code of other withdrawal of this user', async () => {
    await banking.withdrawalCreate('4630308028175088', 'card_rub', 'RUB', 100);
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});
