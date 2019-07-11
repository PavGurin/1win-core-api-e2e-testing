import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg, checkSuccess } from '../../../src/responseChecker';
import { mail } from '../../../src/methods/mail';
import { sleep } from '../../../src/methods/utils';
import { logOut } from '../../../src/methods/user';
import { checkMailRequisites } from '../../../src/expects/exMail';
import { mysqlConnection } from '../../../src/methods/mysqlConnection';

describe('Withdrawal confirm invalid', () => {
  it('C19338 (-) Incorrect code code response 403', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 10704 });
    // console.log(data);
    checkErrMsg(data, 403, 'Выплата не найдена');
  });

  it('C19339 (-) Incorrect code response 400', async () => {
    await userList.loginWithRealMoney();
    await banking.withdrawalCreate(100, '1111222200003333', 'card_rub', 'RUB');
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 99 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
});

describe('Withdrawal with confirmation codes', () => {
  let receivedMail = {};
  const balance = {};
  let user = {};

  beforeEach(async () => {
    user = await register.regMailWithConfirmationCodes();
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 200 WHERE id_user = ${user.data.id} ;`);
    balance.before = 200;
    await banking.withdrawalCreate(100, '5469550073662048', 'card_rub', 'RUB');
    // задержка для получения письма
    await sleep(4000);
    receivedMail = await mail.getMessage(user.data.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение вывода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });
  afterEach(async () => { await logOut(); });

  it('C27036 (+) Correct code', async () => {
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);
  });

  it('C27120 (-) Active code of other user', async () => {
    await logOut();
    await userList.loginWithRealMoney();
    await banking.withdrawalCreate(100, '5469550073662048',
      'card_rub', 'RUB');
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirm.status).to.equal(200);
    checkErrMsg(confirm.data, 403, 'Выплата не найдена');
  });

  it.skip('C27121 (-) Expired code', async () => {
    // пока падает по таймауту
    // надо ждать 5 минут (300 000 мс), а у нас в настройках задан таймаут 10000 мс
    // Error: Timeout of 10000ms exceeded.

    // задержка в 5 минут, чтобы код протух
    await sleep(300000);
    const confirmData = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    // checkErrMsg(confirmData.data, 404, 'Выплата не найдена');
  });

  it('C27120 (-) Second confirmation with the same code', async () => {
    // первое подтверждение
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // второе подтверждение
    const confirm2 = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData2);
    expect(confirm2.status).to.equal(200);
    checkErrMsg(confirm2.data, 403, 'Выплата не найдена');
  });

  it('C27220 (-) Active code of other operation that was obtained after withdrawal code', async () => {
    await banking.transferCreate(20, 'RUB');
    await sleep(4500);
    const transferMail = await mail.getMessage(user.data.email);
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: transferMail.code });
    expect(confirm.status).to.equal(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C27221 (-) Active code of other withdrawal of this user', async () => {
    await banking.withdrawalCreate(100, '5469550073662048', 'card_rub', 'RUB');
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    expect(confirm.status).to.equal(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C27120 (+) Balance checking after successful withdrawal', async () => {
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // проверка баланса после вывода
    balance.after = await banking.balanceCheck();
    expect(balance.after).to.equal(balance.before - 100);
  });

  it('C27201 (-) Balance checking after not successful withdrawal', async () => {
    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code + 1 });
    // console.log(confirmData);
    expect(confirm.data.status).to.equal(400);

    // проверка баланса после вывода
    balance.after = await banking.balanceCheck();
    expect(balance.after).to.equal(balance.before);
  });
});

describe('Transfer before withdrawal', () => {
  it('C27222 (-) Active code of other operation that was obtained before withdrawal code', async () => {
    const user = await register.regMailWithConfirmationCodes();
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 200 WHERE id_user = ${user.data.id} ;`);

    await banking.transferCreate(20, 'RUB');
    await sleep(4500);
    const transferMail = await mail.getMessage(user.data.email);
    // console.log(transferMail);

    await banking.withdrawalCreate(100, '1234123412341234', 'card_rub', 'RUB');

    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: transferMail.code });
    // console.log(confirmData);
    expect(confirm.status).to.equal(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});
