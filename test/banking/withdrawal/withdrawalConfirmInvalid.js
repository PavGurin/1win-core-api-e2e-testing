import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { checkErrMsg } from '../../../src/responseChecker';
import { mail } from '../../../src/methods/mail';
import { sleep } from '../../../src/methods/utils';
import { userPool } from '../../../src/methods/userPool';

describe('Withdrawal confirm invalid', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 120;
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
  });

  it('C19338 (-) Incorrect code code response 403', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 10704 });
    // console.log(data);
    checkErrMsg(data, 403, 'Выплата не найдена');
  });

  it('C19339 (-) Incorrect code response 400', async () => {
    await userList.loginWithRealMoney();
    await banking.withdrawalCreate('4630308028175088', 'card_rub', 'RUB', 100);
    const { data } = await socket.send('BANKING:withdrawal-confirm', { code: 99 });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный ключ запроса');
  });

  it('C27222 (-) Active code of other operation that was obtained before withdrawal code', async () => {
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);

    await banking.transferCreate(20, 'RUB');
    await sleep(4500);
    const transferMail = await mail.getMessage(currentUser.email);
    // console.log(transferMail);

    await banking.withdrawalCreate('4630308028175088', 'card_rub', 'RUB', 100);

    const confirm = await socket.send('BANKING:withdrawal-confirm', { code: transferMail.code });
    // console.log(confirmData);
    expect(confirm.status).toEqual(200);
    checkErrMsg(confirm.data, 400, 'Неверный ключ запроса');
  });
});
