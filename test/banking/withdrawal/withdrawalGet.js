import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';
import { userPool } from '../../../src/methods/userPool';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';

describe('Withdrawal get', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 220;
  let receivedMail = {};
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
  });

  describe('Invalid Id withdrawal', () => {
    it('C19364 (-) Get - Bad request, id is required ', async () => {
      const { data } = await socket.send('BANKING:withdrawal-get', { id: null });
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, id is required');
    });

    it('C19361 (-) Get - withdrawal not found', async () => {
      const { data } = await socket.send('BANKING:withdrawal-get', { id: 0 });
      // console.log(data);
      checkErrMsg(data, 404, 'Выплата не найдена');
    });
  });

  describe('Withdrawal get card_rub', () => {
    beforeEach(async () => {
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C19363 (+) Get - 100 RUB card_rub ', async () => {
      await banking.withdrawalCreate('5469550073662048', 'card_rub', 'RUB', 100);

      // задержка для получения письма
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-get', { id: confirm.data.id });
      // console.log(data);

      expect(data.id).toEqual(confirm.data.id);
      expect(data.time).toBeLessThanOrEqual(new Date().getTime());
      expect(data.payment_system).toEqual('card_rub');
      expect(data.amount).toEqual(100);
      expect(data.status).toEqual(0);
      expect(data.wallet).toEqual('5469550073662048');
    });


    it('C19362 (+) Get - 100 RUB money-transfer ', async () => {
      await banking.transferCreate(20, 'RUB');
      // задержка, чтобы письмо успело придти на почту
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });

      const data1 = await socket.send('BANKING:withdrawal-history');

      const { data } = await socket.send('BANKING:withdrawal-get', { id: data1.data[0].id });

      expect(data.id).toEqual(data1.data[0].id);
      expect(data.time).toBeLessThanOrEqual(new Date().getTime());
      expect(data.payment_system).toEqual('money-transfer');
      expect(data.amount).toEqual(20);
      expect(data.status).toEqual(1);
      expect(data.wallet).toEqual('192');
    });
  });
});
