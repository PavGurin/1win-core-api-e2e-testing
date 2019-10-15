import { expect } from 'chai';
import { getNewSocket } from '../../../global';
import { userPool } from '../../../../src/methods/userPool';
import { userList } from '../../../../src/methods/userList';
import { cases } from '../../../../src/methods/cases';
import { banking } from '../../../../src/methods/banking';
import {
  setUserDemoWithdrawal,
  setUserWithdrawalBlock,
  setUserWithdrawalManualControl,
} from '../../../../src/methods/user';
import { checkErrMsg } from '../../../../src/responseChecker';
import { addBetToBD } from '../../../../src/methods/betsInBD';
import { register } from '../../../../src/methods/register';


describe('Recoupument tests RUB', () => {
  // юзеры с одним депозитом
  describe('One deposit', () => {
    const USERS_NUMBER = 7;
    const DEPOSIT_AMOUNT = 100;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
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

    it('C1021290 - (-) nothing spent, withdraw money', async () => {
      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021291 - (-) spent part of deposit, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021292 - (+) spent all money, withdraw amount < balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result);
      // console.log(create);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1021293 - (-) spent all money, withdraw amount > balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10000);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10000');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });

    it('C1022178 - (+) spent all money, cases played several times, withdraw amount < balance', async () => {
      await cases.playCaseWithoutChance(socket, 3);
      await cases.playCaseWithoutChance(socket, 3);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10000);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1086873 - (+) deposit + case + withdrawal, withdraw again', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result / 2);

      const { data: check } = await banking.checkWithdrawalPossible(socket, data.result / 2);
      expect(check.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result / 2);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1090487 - (-) deposit + case + withdrawal + new deposit, withdraw again', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result / 2);
      await banking.createDepositInBD(currentUser.id, 100, new Date(), 'mts_rub', '79111223366', 1);
      const { data: check } = await banking.checkWithdrawalPossible(socket, data.result / 2);
      expect(check.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result / 2);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });
  });


  // юзеры с несколькими депозитами
  describe('Several deposits', () => {
    const USERS_NUMBER = 6;
    const DEPOSIT_AMOUNT = 100;
    const DEPOSIT_PER_USER = 2;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositRub(socket,
        USERS_NUMBER, DEPOSIT_AMOUNT, DEPOSIT_PER_USER);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket,
        currentUser.email, currentUser.password);
      // console.log(currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C1021294 - (-) nothing spent, withdraw money', async () => {
      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021295 - (-) spent part of one deposit, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021296 - (-) spent one deposit, withdraw earned money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021297 - (-) spent one deposit and part of other, withdraw money', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 1);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021298 - (+) spent all money, withdraw amount < balance', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 4);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1091384 - (-) spent all money, withdraw amount > balance', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 4);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10000');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });
  });


  // юзеры, которым был один трансфер
  describe('One transfer', () => {
    const USERS_NUMBER = 4;
    const DEPOSIT_AMOUNT = 100;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithTransferRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket,
        currentUser.email, currentUser.password);
      // console.log(currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C1021299 - (-) nothing spent, withdraw money', async () => {
      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021300 - (-) spent part of transfer, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021301 - (+) spent all money, withdraw amount < balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', data.result / 2);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1021302 - (-) spent all money, withdraw amount > balance', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10000');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });
  });


  // юзеры, которым было несколько трансферов
  describe('Several transfers', () => {
    const USERS_NUMBER = 6;
    const DEPOSIT_AMOUNT = 100;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithTransferRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT, 2);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket,
        currentUser.email, currentUser.password);
      // console.log(currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C1021303 - (-) nothing spent, withdraw money', async () => {
      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021304 - (-) spent part of one transfer, withdraw money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 2);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021305 - (-) spent one transfer, withdraw earned money', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, data.result);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021306 - (-) spent one transfer and part of other, withdraw money', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 1);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 10);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021307 - (+) spent all money, withdraw amount < balance ', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 4);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1091385 - (-) spent all money, withdraw amount > balance', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await cases.playCaseWithoutChance(socket, 4);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket, 100500);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10000');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });
  });


  // юзеры, которые делют исходящий перевод
  describe('Users with transfer from', () => {
    const USERS_NUMBER = 5;
    const DEPOSIT_AMOUNT = 200;
    let socket;
    let users = [];
    let currentUser = {};

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket,
        currentUser.email, currentUser.password);
      // console.log(currentUser.email, currentUser.password);
    });

    afterEach(async () => { await socket.disconnect(); });

    it('C1021308 - (+) transfer all deposit, can withdraw any amount', async () => {
      await banking.transferCreate(socket, DEPOSIT_AMOUNT, 'RUB');
      const { data } = await banking.checkWithdrawalPossible(socket, 10);
      expect(data.result).equal(true);
    });

    it('C1021309 - (-) transfer part of deposit, withdraw money', async () => {
      await banking.transferCreate(socket, 100, 'RUB');
      const { data } = await banking.checkWithdrawalPossible(socket, 10);
      expect(data.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021310 - (-) transfer part of deposit, spent part of remaining money, withdraw money', async () => {
      await banking.transferCreate(socket, 100, 'RUB');
      await cases.playCaseWithoutChance(socket, 1);
      const { data } = await banking.checkWithdrawalPossible(socket, 10);
      expect(data.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1021311 - (+) transfer part of deposit, spent remained money, withdraw amount <= balance', async () => {
      await banking.transferCreate(socket, 100, 'RUB');
      await cases.playCaseWithoutChance(socket, 4);
      const { data } = await banking.checkWithdrawalPossible(socket, 100500);
      expect(data.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1091386 - (-) transfer part of deposit, spent remained money, withdraw amount > balance', async () => {
      await banking.transferCreate(socket, 100, 'RUB');
      await cases.playCaseWithoutChance(socket, 4);
      const { data } = await banking.checkWithdrawalPossible(socket, 100500);
      expect(data.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10000');
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });
  });


  // Юзеры с withdrawal block & withdrawal manual control
  describe('Withdrawal block and manual control', () => {
    let socket;
    const USERS_NUMBER = 6;
    const DEPOSIT_AMOUNT = 100;
    let users = [];
    let currentUser = {};
    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
      await socket.disconnect();
    });
    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });
    afterEach(async () => { await socket.disconnect(); });

    it('C1086845 - (-) withdrawal block, nothing spent', async () => {
      await setUserWithdrawalBlock(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1086846 - (+) withdrawal block, spent all deposit', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await setUserWithdrawalBlock(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1086847 - (-) withdrawal manual control, nothing spent', async () => {
      await setUserWithdrawalManualControl(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', DEPOSIT_AMOUNT);
      // console.log(create);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1086848 - (+) withdrawal manual control, spent all deposit', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await setUserWithdrawalManualControl(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    // непонятно что должно быть, сейчас вывести нельзя
    it('C1086871 - (?) user demo withdrawal, nothing spent', async () => {
      await setUserDemoWithdrawal(currentUser.id);
      await setUserWithdrawalBlock(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(true);
    });

    it('C1086872 - (+) user demo withdrawal, spent all deposit', async () => {
      await cases.playCaseWithoutChance(socket, 4);
      await setUserDemoWithdrawal(currentUser.id);
      await setUserWithdrawalBlock(currentUser.id);
      const { data } = await banking.checkWithdrawalPossible(socket, 100);
      // console.log(data);
      expect(data.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', '10');
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });
  });

  // скип, по очередной версии требований ограничения на коэффициент нет
  describe.skip('Bets coeffs', () => {
    const LOSE = 1;
    const WIN = 2;
    const USERS_NUMBER = 13;
    const DEPOSIT_AMOUNT = 100;
    let socket;
    let users = [];
    let currentUser;

    beforeAll(async () => {
      socket = await getNewSocket();
      users = await userPool.usersWithDepositRub(socket, USERS_NUMBER, DEPOSIT_AMOUNT);
      // console.log(users);
      await socket.disconnect();
    });

    beforeEach(async () => {
      socket = await getNewSocket();
      currentUser = users.pop();
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });
    afterEach(async () => { await socket.disconnect(); });

    it('C1139208 - (+), bet with coeff > 1.1 (win), withdraw amount < balance', async () => {
      const betAmount = 100;
      const betCoeff = 2.75;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
      await banking.setBalance(currentUser.id, betAmount * betCoeff);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1139209 - (-), bet with coeff > 1.1 (win), withdraw amount > balance', async () => {
      const betAmount = 100;
      const betCoeff = 2.75;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
      await banking.setBalance(currentUser.id, betAmount * betCoeff);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff + 1);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff + 1).toFixed(2));
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });

    it('C1139220 - (+), bet with coeff = 1.1 (win)', async () => {
      const betAmount = 100;
      const betCoeff = 1.1;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
      await banking.setBalance(currentUser.id, betAmount * betCoeff);
      // console.log(currentUser.id);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1139232 - (-), bet with coeff < 1.1 (win)', async () => {
      const betAmount = 100;
      const betCoeff = 1.09;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
      await banking.setBalance(currentUser.id, betAmount * betCoeff);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1140136 - (-), bet with coeff < 1.1 (win) + cases', async () => {
      const betAmount = 50;
      const betCoeff = 1.09;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, WIN);
      await banking.setBalance(currentUser.id, betAmount * betCoeff);

      const { data: casesResult } = await cases.playCaseWithoutChance(socket, 3);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        casesResult.result);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', casesResult.result);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1143819 - (+), bet with coeff > 1.1 (lose), withdrawal check = true', async () => {
      const betAmount = 100;
      const betCoeff = 2.75;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
      await banking.setBalance(currentUser.balance - betAmount);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(true);
    });

    it('C1143820 - (-), bet with coeff > 1.1 (lose), withdraw amount > balance', async () => {
      const betAmount = 100;
      const betCoeff = 2.75;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
      await banking.setBalance(currentUser.balance - betAmount);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff + 1);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff + 1).toFixed(2));
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });

    it('C1143821 - (+), bet with coeff = 1.1 (lose)', async () => {
      const betAmount = 100;
      const betCoeff = 1.1;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
      await banking.setBalance(currentUser.balance - betAmount);
      // console.log(currentUser.id);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
      // console.log(withdrawalCreate);
      checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
    });

    it('C1143822 - (-), bet with coeff < 1.1 (lose)', async () => {
      const betAmount = 100;
      const betCoeff = 1.09;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
      await banking.setBalance(currentUser.balance - betAmount);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * betCoeff);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', (betAmount * betCoeff).toFixed(2));
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1143823 - (-), bet with coeff < 1.1 (win) + cases', async () => {
      const betAmount = 50;
      const betCoeff = 1.09;
      await addBetToBD(currentUser.id, 'RUB', betAmount, betCoeff, LOSE);
      await banking.setBalance(currentUser.balance - betAmount);


      const { data: casesResult } = await cases.playCaseWithoutChance(socket, 3);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        casesResult.result);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', casesResult.result);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1146557 - (+), several bets with coeff > 1.1', async () => {
      const betAmount = 50;
      const coef1 = (Math.random() * (9) + 1).toFixed(2);
      const coef2 = (Math.random() * (9) + 1).toFixed(2);

      await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
      await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
      await banking.setBalance(currentUser.id, betAmount * coef1);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * coef1);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', betAmount * coef1);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1146558 - (-), several bets with coeff < 1.1 ', async () => {
      const betAmount = 50;
      const coef1 = 1.02;
      const coef2 = 1.07;

      await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
      await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
      await banking.setBalance(currentUser.id, betAmount * coef1);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * coef1);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', betAmount * coef1);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });

    it('C1146559 - (-), bet with coeff > 1.1 + bet with coeff < 1.1', async () => {
      const betAmount = 50;
      const coef1 = 1.02;
      const coef2 = 5.66;

      await addBetToBD(currentUser.id, 'RUB', betAmount, coef1, WIN);
      await addBetToBD(currentUser.id, 'RUB', betAmount, coef2, LOSE);
      await banking.setBalance(currentUser.id, betAmount * coef1);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * coef1);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', betAmount * coef1);
      expect(withdrawalCreate.withdrawalBlocked).equal(true);
    });
  });

  // скип, по очередной версии требований ограничения на коэффициент нет
  describe.skip('Users with bet with coeff < 1.1', () => {
    // формула расчета возможности вывода:
    // сonst amountShouldBeSpent = balance < deposits - lostMoney ? balance : deposits;
    // lostMoney >= amountShouldBeSpent - тогда можо выводить

    const LOSE = 1;
    const WIN = 2;
    let socket;
    beforeEach(async () => {
      socket = await getNewSocket();
    });
    afterEach(async () => { await socket.disconnect(); });

    it('C1362817 - (+), lostMoney = 0 (bet on coeff < 1.1 - lose)', async () => {
      const depositAmount = 200;
      const betAmount = 100;
      const coeff = 1.09;
      const { data: user } = await register.usualRegMailru(socket);
      await banking.createDepositInBD(user.id, depositAmount, new Date(), 'card_rub', '2323565689897474', 1);
      await addBetToBD(user.id, 'RUB', betAmount, coeff, LOSE);
      await banking.setBalance(user.id, depositAmount - betAmount);
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        depositAmount - betAmount);
      expect(withdrawalCheck.result).equal(true);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', depositAmount - betAmount);
      expect(withdrawalCreate.confirmationRequested).equal(false);
    });

    it('C1147472 - (-), lostMoney = 0 (bet on coeff < 1.1 - win)', async () => {
      const depositAmount = 200;
      const betAmount = 100;
      const coeff = 1.09;
      const { data: user } = await register.usualRegMailru(socket);
      await banking.createDepositInBD(user.id, depositAmount, new Date(), 'card_rub', '2323565689897474', 1);
      await addBetToBD(user.id, 'RUB', betAmount, coeff, WIN);
      await banking.setBalance(user.id, depositAmount - betAmount + betAmount * coeff);
      const { data } = await cases.playCaseWithoutChance(socket, 4);
      // console.log(data);

      const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(socket,
        betAmount * coeff);
      // console.log(withdrawalCheck);
      expect(withdrawalCheck.result).equal(false);

      const { data: withdrawalCreate } = await banking.withdrawalCreate(socket, '79116665544', 'mts_rub', 'RUB', betAmount * coeff);
      // console.log(withdrawalCreate);
      expect(withdrawalCreate.confirmationRequested).equal(true);
    });
  });
});
