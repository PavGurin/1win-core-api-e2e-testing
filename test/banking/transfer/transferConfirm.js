import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg, checkSuccess } from '../../../src/responseChecker';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { logOut } from '../../../src/methods/user';
import { mysqlConnection } from '../../../src/methods/mysqlConnection';
import { checkMailRequisites } from '../../../src/expects/exMail';


describe('Transfer confirm invalid', () => {
  it('C19365 (-) Incorrect code with 404 code response', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 5372831 });
    // console.log(data);
    checkErrMsg(data, 404, 'Перевод не найден');
  });
});

describe('Transfer confirm with money', () => {
  it('C19366 (-) Incorrect code with 400 code response', async () => {
    await userList.loginWithRealMoney();
    await banking.transferCreate(100, 'RUB');
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 111 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });
});

describe('Transfer confirm with receiving code', () => {
  let receivedMail = {};
  let user = {};

  // перед каждым тестом просиходит логин, ссздание перевода, получение письма с почты
  beforeEach(async () => {
    user = await register.regMailWithConfirmationCodes();
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 120 WHERE id_user = ${user.data.id} ;`);
    await banking.transferCreate(120, 'RUB');
    // задержка, чтобы письмо успело придти на почту
    await sleep(4000);
    receivedMail = await mail.getMessage(user.data.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение перевода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });
  afterEach(async () => {
    await logOut();
  });

  it('C21435 (+) Correct code', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    checkSuccess(confirm);
  });

  it('C21436 (-) Active code of other user with 400 code response', async () => {
    await logOut();
    await userList.loginWithRealMoney();
    await banking.transferCreate(20, 'RUB');

    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirm.status).to.equal(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C21437 (-) Expired code with 404 code response', async () => {
    // на стейдже код протухнет через 30 секунд
    // на проде этот тест упадет, т.к. таймаут задан для всех тестов 40 секунд
    await sleep(transferExpirationTime - 4000);
    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    checkErrMsg(confirmData.data, 404, 'Перевод не найден');
  });

  it('C21438 (-) Second confirmation with the same code', async () => {
    // первое подтверждение
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // второе подтверждение
    const confirm2 = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData2);
    expect(confirm2.status).to.equal(200);
    checkErrMsg(confirm2.data, 400, 'Неверный ключ запроса');
  });

  it('C27217 (-) Active code of other operation that was obtained after transfer code', async () => {
    await banking.withdrawalCreate(100, '1234123412341234', 'card_rub', 'RUB');
    await sleep(4000);
    const withdrawalMail = await mail.getMessage(user.data.email);
    // console.log(withdrawalMail);
    const confirm = await socket.send('BANKING:transfer-confirm', { code: withdrawalMail.code });
    expect(confirm.status).to.equal(200);
    // console.log(confirmData);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C27218 (-) Active code of other transfer of this user', async () => {
    // console.log(receivedMail);
    await banking.transferCreate(25.1, 'RUB');
    // sleep(4000);
    // await mail.getMessage(user.data.email);
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    expect(confirm.status).to.equal(200);
    // console.log(confirmData);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});

describe('Withdrawal before transfer', () => {
  it('C27219 (-) Active code of other operation that was obtained before transfer code', async () => {
    const user = await register.regMailWithConfirmationCodes();
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 120 WHERE id_user = ${user.data.id} ;`);
    await banking.withdrawalCreate(100, '1234123412341234', 'card_rub', 'RUB');
    await sleep(4000);
    const withdrawalMail = await mail.getMessage(user.data.email);

    await banking.transferCreate(20, 'RUB');

    const confirm = await socket.send('BANKING:transfer-confirm', { code: withdrawalMail.code });
    expect(confirm.status).to.equal(200);
    // console.log(confirmData);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});

describe('Balance checking', () => {
  // в этом объекте хранится инфа из письма с почты
  let receivedMail = {};
  // баланс до перевода у обоих пользователей
  const balance = {};

  beforeEach(async () => {
    // проверка баланса у пользователя, которому будет перевод, до перевода
    await userList.loginTransferToUser();
    balance.TransferToUserBefore = await banking.balanceCheck();
    await logOut();

    // проверка баланса у пользователя, который будет делать перевод, до перевода
    const user = await register.regMailWithConfirmationCodes();
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 20 WHERE id_user = ${user.data.id} ;`);
    balance.TransferFromUserBefore = 20;

    await banking.transferCreate(20, 'RUB');
    // задержка, чтобы письмо успело придти на почту
    await sleep(4000);
    receivedMail = await mail.getMessage(user.data.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение перевода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });

  afterEach(async () => { await logOut(); });

  it('C21440 (+) after successful transfer', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    checkSuccess(confirm);

    // проверка баланса у пользователя, который делал перевод, после перевода
    balance.TransferFromUserAfter = await banking.balanceCheck();

    // проверка баланса у пользователя, которому был перевод, после перевода
    await logOut();
    await userList.loginTransferToUser();
    balance.TransferToUserAfter = await banking.balanceCheck();

    expect(balance.TransferFromUserAfter).to.equal(balance.TransferFromUserBefore - 20);
    expect(balance.TransferToUserAfter).to.equal(balance.TransferToUserBefore + 20);
  });

  it('C27200 (-) after not successful transfer', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code + 1 });
    expect(confirm.status).to.equal(200);
    expect(confirm.data.status).to.equal(400);

    // проверка баланса у пользователя, который делал перевод, после перевода
    balance.TransferFromUserAfter = await banking.balanceCheck();

    // проверка баланса у пользователя, которому был перевод, после перевода
    await logOut();
    await userList.loginTransferToUser();
    balance.TransferToUserAfter = await banking.balanceCheck();

    expect(balance.TransferFromUserAfter).to.equal(balance.TransferFromUserBefore);
    expect(balance.TransferToUserAfter).to.equal(balance.TransferToUserBefore);
  });
});
