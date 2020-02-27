/**
 * @jest-environment node
 */


import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';

// returns withdrawals sorted by time
describe('Withdrawal history', () => {
  const USERS_NUMBER = 1;
  const BALANCE = 120;
  let receivedMail = {};
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
  });

  describe('User without money', () => {
    it('C19359 - (+) without withdrawal', async () => {
      await register.oneClickReg();
      const { data } = await socket.send('BANKING:withdrawal-history');
      // console.log(data);
      expect(data.length).toEqual(0);
    });
  });

  describe('User with money', () => {
    beforeEach(async () => {
      currentUser = users.pop();
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C19360 -(+) with withdrawal @dev', async () => {
      await banking.withdrawalCreate('4630308028175088', 'card_rub', 'RUB', 100);
      // задержка для получения письма
      await sleep(10000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-history');
      // console.log(data);
      expect(data[0].payment_system).toEqual('card_rub');
      expect(data[0].amount).toEqual(100);
      expect(data[0].status).toEqual(0);
    });


    it('C396397 (+) - Sort list, first must be last withdrawal ', async () => {
      await banking.transferCreate(20, 'RUB');
      await sleep(10000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });

      await banking.withdrawalCreate('5469550073662048', 'card_rub', 'RUB', 100);

      await sleep(10000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-history');

      // console.log(data);

      expect(data[0].payment_system).toEqual('card_rub');
      expect(data[0].amount).toEqual(100);
      expect(data[0].status).toEqual(0);
      expect(data[1].payment_system).toEqual('money-transfer');
      expect(data[1].amount).toEqual(20);
      expect(data[1].status).toEqual(1);
    });
  });
});
