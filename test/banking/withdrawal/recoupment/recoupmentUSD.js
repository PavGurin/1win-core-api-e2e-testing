import { expect } from 'chai';
import { getNewSocket } from '../../../global';
import { userPool } from '../../../../src/methods/userPool';
import { userList } from '../../../../src/methods/userList';
import { cases } from '../../../../src/methods/cases';
import { banking } from '../../../../src/methods/banking';
import { checkErrMsg } from '../../../../src/responseChecker';

describe('Recoupument tests USD', () => {
  // юзеры с одним депозитом
  describe('One deposit', () => {
    const USERS_NUMBER = 4;
    const DEPOSIT_AMOUNT = 100;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositUSD(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket,
        currentUser.email, currentUser.password);
      // console.log(currentUser);
    });

    afterEach(async () => { await socket.disconnect(); });

    // пока отыгрыши с валютой не работают
    // тест будет фейлиться
    it('C1086849 - (-) nothing spent, withdraw money', async () => {
      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '1212363645457878', 'card', 'USD', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    // пока отыгрыши с валютой не работают
    // тест будет фейлиться
    it('C1086850 - (-) spent part of deposit, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 10);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '1212363645457878', 'card', 'USD', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1086857 - (+) spent all money, withdraw amount < balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 24);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '1212363645457878', 'card', 'USD', data.result);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(true);
    });

    it('C1086858 - (+) spent all money, withdraw amount > balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 24);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '1212363645457878', 'card', 'USD', '500');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });
  });
});
