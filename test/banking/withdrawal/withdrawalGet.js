import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';
import { userPool } from '../../../src/methods/userPool';
import { logOut } from '../../../src/methods/user';
import { banking } from '../../../src/methods/banking';
import { sleep } from '../../../src/methods/utils';
import { mail } from '../../../src/methods/mail';
import { getNewSocket } from '../../global';

describe('Withdrawal get', () => {
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
    await socket.disconnect();
  });

  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(async () => { await socket.disconnect(); });

  describe('Invalid Id withdrawal', () => {
    it('C19364 (-) Get - Bad request, id is required ', async () => {
      const { data } = await socket.send('BANKING:withdrawal-get', { id: null });
      // console.log(data);
      checkErrMsg(data, 400, 'Bad request, id is required');
    });

    it('C19361 (-) Get - withdrawal not found - auth', async () => {
      const { data } = await socket.send('BANKING:withdrawal-get', { id: 0 });
      // console.log(data);
      checkErrMsg(data, 404, 'Выплата не найдена');
    });
  });

  describe('Withdrawal get card_rub', () => {
    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C19363 (+) Get - 100 RUB card_rub ', async () => {
      await banking.withdrawalCreate(socket, '5469550073662048', 'card_rub', 'RUB', 100);

      // задержка для получения письма
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      const confirm = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });

      const { data } = await socket.send('BANKING:withdrawal-get', { id: confirm.data.id });
      // console.log(data);

      expect(data.id).equal(confirm.data.id);
      expect(data.time).to.be.below(new Date().getTime());
      expect(data.payment_system).equal('card_rub');
      expect(data.amount).equal(100);
      expect(data.status).equal(0);
      expect(data.wallet).equal('5469550073662048');
    });


    it('C19362 (+) Get - 100 RUB money-transfer ', async () => {
      await banking.transferCreate(socket, 20, 'RUB');
      // задержка, чтобы письмо успело придти на почту
      await sleep(4000);
      receivedMail = await mail.getMessage(currentUser.email);
      await socket.send('BANKING:transfer-confirm', { code: receivedMail.code });

      const data1 = await socket.send('BANKING:withdrawal-history');

      const { data } = await socket.send('BANKING:withdrawal-get', { id: data1.data[0].id });

      expect(data.id).equal(data1.data[0].id);
      expect(data.time).to.be.below(new Date().getTime());
      expect(data.payment_system).equal('money-transfer');
      expect(data.amount).equal(20);
      expect(data.status).equal(1);
      expect(data.wallet).equal('192');
    });
  });
});
