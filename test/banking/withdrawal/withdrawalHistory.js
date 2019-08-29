import { expect } from 'chai';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { userPool } from '../../../src/methods/userPool';
import { logOut } from '../../../src/methods/user';
import { userList } from '../../../src/methods/userList';

// returns withdrawals sorted by time
describe('Withdrawal history', () => {
  const USERS_NUMBER = 2;
  const BALANCE = 120;
  let receivedMail = {};
  let currentUser = {};
  let users = [];

  beforeAll(async () => {
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(socket, USERS_NUMBER, BALANCE);
  });

  describe('User without money', () => {
    it('C19359 - (+) without withdrawal', async () => {
      await register.oneClickReg(socket);
      const { data } = await socket.send('BANKING:withdrawal-history');
      // console.log(data);
      expect(data.length).equal(0);
    });
  });

  describe('User with money', () => {
    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C19360 -(+) with withdrawal @dev', async () => {
      await banking.withdrawalCreate(100, '1111222233334444', 'card_rub', 'RUB');
      // задержка для получения письма
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-history');
      // console.log(data);
      expect(data[0].payment_system).equal('card_rub');
      expect(data[0].amount).equal(100);
      expect(data[0].status).equal(0);
    });


    it('C396397 (+) - Sort list, first must be last withdrawal ', async () => {
      await banking.transferCreate(20, 'RUB');
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });

      await banking.withdrawalCreate(100, '5469550073662048', 'card_rub', 'RUB');

      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-history');

      // console.log(data);

      expect(data[0].payment_system).equal('card_rub');
      expect(data[0].amount).equal(100);
      expect(data[0].status).equal(0);
      expect(data[1].payment_system).equal('money-transfer');
      expect(data[1].amount).equal(20);
      expect(data[1].status).equal(1);
    });
  });
});
