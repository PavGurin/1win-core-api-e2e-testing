import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { logOut } from '../../../src/methods/user';


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
// TODO что-то вынести в отдельные функции?

  it('C21435 (+) Correct code', async () => {
    const loginData = await userList.loginWithMailConfirmationCodes();
    await banking.transferCreate(20, 'RUB');

    // задержка, чтобы письмо успело придти на почту
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение перевода');

    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.error).to.equal(false);
  });

  it('C21436 (-) Active code of other user with 400 code response', async () => {
    const loginData = await userList.loginWithMailConfirmationCodes();
    await banking.transferCreate(20, 'RUB');

    // задержка, чтобы письмо успело придти на почту
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение перевода');

    await logOut();
    await userList.loginWithRealMoney();
    await banking.transferCreate(20, 'RUB');

    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.status).to.equal(400);
    expect(confirmData.data.message).to.equal('Неверный ключ запроса');
  });

  it.skip('C21437 (-) Expired code with 404 code response', async () => {
    // пока падает по таймауту
    // надо ждать 5 минут (300 000 мс), а у нас в настройках задан таймаут 10000 мс
    // Error: Timeout of 10000ms exceeded.

    const loginData = await userList.loginWithMailConfirmationCodes();
    await banking.transferCreate(20, 'RUB');

    // задержка, чтобы письмо успело придти на почту
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение перевода');

    // задержка в 5 минут, чтобы код протух
    sleep(300000);
    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.status).to.equal(404);
    // expect(confirmData.data.message).to.equal('Неверный ключ запроса');
  });

  it('C21438 (-) Second confirmation with the same code', async () => {
    // пока будет падать, т.к. в ответ приходит 500 вместо 400 и сообщения об ошибке
    // баг https://fbet-gitlab.ex2b.co/initial-tasks/backend/issues/110
    const loginData = await userList.loginWithMailConfirmationCodes();
    await banking.transferCreate(20, 'RUB');

    // задержка, чтобы письмо успело придти на почту
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение перевода');

    // первое подтверждение
    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.error).to.equal(false);

    // второе подтверждение
    const confirmData2 = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData2);
    expect(confirmData2.status).to.equal(200);
    expect(confirmData2.data.status).to.equal(400);
    expect(confirmData2.data.message).to.equal('Неверный ключ запроса');
  });

  it('C21440 (+) Balance checking after successful transfer', async () => {
    // проверка баланса у пользователя, которому будет перевод, до перевода
    await userList.loginTransferToUser();
    const balanceBefore1 = await banking.balanceCheck();
    await logOut();

    // проверка баланса у пользователя, который будет делать перевод, до перевода
    const loginData = await userList.loginWithMailConfirmationCodes();
    const balanceBefore2 = await banking.balanceCheck();

    // перевод
    await banking.transferCreate(20, 'RUB');
    // задержка, чтобы письмо успело придти на почту
    sleep(4000);
    const receivedMail = await mail.getMessage(loginData.data.email);
    expect(receivedMail.subject).to.equal('1Win - Подтверждение перевода');
    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).to.equal(200);
    expect(confirmData.data.error).to.equal(false);

    // проверка баланса у пользователя, который делал перевод, после перевода
    const balanceAfter2 = await banking.balanceCheck();
    expect(balanceAfter2).to.equal(balanceBefore2 - 20);

    // проверка баланса у пользователя, которому был перевод, после перевода
    await logOut();
    await userList.loginTransferToUser();
    const balanceAfter1 = await banking.balanceCheck();
    expect(balanceAfter1).to.equal(balanceBefore1 + 20);
  });
});
