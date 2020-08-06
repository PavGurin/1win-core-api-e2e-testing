/**
 * @jest-environment node
 */


import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { userPool } from '../../../src/methods/userPool';


describe('Transfer confirm invalid', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 120;
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
  });

  it('C19365 (-) Incorrect code with 404 code response', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 5372831 });
    // console.log(data);
    checkErrMsg(data, 404, 'Перевод не найден');
  });

  it('C19366 (-) Incorrect code with 400 code response with money', async () => {
    await userList.loginWithRealMoney();
    await banking.transferCreate(100, 'RUB');
    const { data } = await socket.send('BANKING:transfer-confirm', { code: 111 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });

  // скип, т.к на стейдже не отправляются письма
  it.skip('C27219 (-) Active code of other operation that was obtained before transfer code', async () => {
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    const { data } = await banking.withdrawalCreate('5121640361313600', 'card_rub', 'RUB', 100);
    // console.log(data);
    await sleep(10000);
    const withdrawalMail = await mail.getMessage(currentUser.email);

    await banking.transferCreate(20, 'RUB');

    const confirm = await socket.send('BANKING:transfer-confirm', { code: withdrawalMail.code });
    expect(confirm.status).toEqual(200);
    // console.log(confirmData);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});
