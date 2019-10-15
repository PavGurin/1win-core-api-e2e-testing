import { expect } from 'chai';
import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { getNewSocket } from '../../global';

// returns withdrawals sorted by time
describe('Withdrawal history', () => {
  const USERS_NUMBER = 2;
  const BALANCE = 120;
  let receivedMail = {};
  let currentUser = {};
  let users = [];
  let socket;

  beforeAll(async () => {
    socket = await getNewSocket();
    // формируем пул юзеров
    users = await userPool.usersWithBalanceRubAndConfirmCodes(socket, USERS_NUMBER, BALANCE);
  });

  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(async () => { await socket.disconnect(); });

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
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C19360 -(+) with withdrawal @dev', async () => {
      await banking.withdrawalCreate(socket, '1111222233334444', 'card_rub', 'RUB', 100);
      // задержка для получения письма
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-history');
      // console.log(data);
      expect(data[0].payment_system).equal('card_rub');
      expect(data[0].amount).equal(100);
      expect(data[0].status).equal(0);
    });


    it('C396397 (+) - Sort list, first must be last withdrawal ', async () => {
      await banking.transferCreate(socket, 20, 'RUB');
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });

      await banking.withdrawalCreate(socket, '5469550073662048', 'card_rub', 'RUB', 100);

      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

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
