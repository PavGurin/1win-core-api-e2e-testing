import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { checkMailRequisites } from '../../../src/expects/exMail';
import { checkErrMsg, checkSuccess } from '../../../src/responseChecker';
import { userPool } from '../../../src/methods/userPool';

const USERS_NUMBER = 1;
const BALANCE = 120;
let receivedMail = {};
let currentUser = {};
let users = [];


describe('Transfer confirm with receiving code', () => {
  // перед каждым тестом просиходит логин, ссздание перевода, получение письма с почты
  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    await banking.transferCreate(20, 'RUB');
    // задержка, чтобы письмо успело придти на почту
    await sleep(4000);
    receivedMail = await mail.getMessage(currentUser.email);
    checkMailRequisites(receivedMail, '1Win - Подтверждение перевода', 'Confirmation - 1Win', 'confirmation@fbet.top');
  });

  it('C21435 (+) Correct code', async () => {
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    checkSuccess(confirm);
  });

  it('C21436 (-) Active code of other user with 400 code response', async () => {
    await banking.transferCreate(20, 'RUB');

    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C21437 (-) Expired code with 404 code response', async () => {
    // на стейдже код протухнет через 30 секунд
    // на проде этот тест упадет, т.к. таймаут задан для всех тестов 40 секунд
    await sleep(transferExpirationTime - 4000);
    const confirmData = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    // console.log(confirmData);
    expect(confirmData.status).toEqual(200);
    checkErrMsg(confirmData.data, 404, 'Перевод не найден');
  });

  it('C21438 (-) Second confirmation with the same code', async () => {
    // первое подтверждение
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    checkSuccess(confirm);

    // второе подтверждение
    const confirm2 = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    expect(confirm2.status).toEqual(200);
    checkErrMsg(confirm2.data, 400, 'Неверный ключ запроса');
  });

  it('C27217 (-) Active code of other operation that was obtained after transfer code', async () => {
    await banking.withdrawalCreate('1234123412341234', 'card_rub', 'RUB', 100);
    await sleep(4000);
    const withdrawalMail = await mail.getMessage(currentUser.email);
    // console.log(withdrawalMail);
    const confirm = await socket.send('BANKING:transfer-confirm', { code: withdrawalMail.code });
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });

  it('C27218 (-) Active code of other transfer of this user', async () => {
    // console.log(receivedMail);
    await banking.transferCreate(25.1, 'RUB');
    const confirm = await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});
