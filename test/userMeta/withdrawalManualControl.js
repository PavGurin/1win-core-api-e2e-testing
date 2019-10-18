import { expect } from 'chai';
import { register } from '../../src/methods/register';
import {
  getUserWithdrawalManualControl,
  logOut,
  setUserWithdrawalManualControl,
} from '../../src/methods/user';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { usersWithManualControl } from '../../src/methods/usersWithBlockAndManualControl';
import { userPool } from '../../src/methods/userPool';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { successDbDeposit } from '../../src/expects/exDatabaseTests';
import { cases } from '../../src/methods/cases';
import { getNewSocket } from '../global';

describe('Withdrawal manual control tests', () => {
  const BLOCKED_WALLET = '9898777766668989';
  let socket;
  beforeEach(async () => { socket = await getNewSocket(); });
  afterAll(async () => socket.disconnect());

  describe('users with no withdrawal_manual_control', () => {
    it('C28385 (+) withdrawal_manual_control = false by default', async () => {
      await register.oneClickReg(socket);
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).equal(false);
    });

    it('C28386 (+) withdrawal_manual_control = false when in db = true', async () => {
      const { data } = await register.usualReg(socket);
      await setUserWithdrawalManualControl(data.id);
      await logOut();
      await userList.loginWithParams(socket, data.email, data.password);
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).equal(false);
    });

    it('C28387 (+) withdrawal_manual_control = true in db after withdrawal to blocked wallet', async () => {
      const { data: user } = await register.usualReg(socket);
      // console.log(currentUser.id);
      await banking.setBalance(user.id);
      await banking.withdrawalCreate(socket, BLOCKED_WALLET, 'card_rub', 'RUB', 200);
      // console.log(withdrawal);

      expect(await getUserWithdrawalManualControl(user.id)).equal('true');
    });

    it('C28388 (+) withdrawal_manual_control = true in db after deposit from blocked wallet', async () => {
      const { data: user } = await register.usualReg(socket);
      // console.log(currentUser.id);

      const { data: deposit } = await banking.depositCreate(socket, BLOCKED_WALLET, 'card_rub', 'RUB', 200);
      expect(deposit.status).equal(500);
      expect(deposit.message).equal('Internal Server Error');
      // console.log(deposit);

      expect(await getUserWithdrawalManualControl(user.id)).equal('true');
    });
  });

  describe('users with withdrawal_manual_control = true', () => {
    const WALLET = '2552699635580001';
    const USERS_NUMBER = 7;
    const BALANCE = 100;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(socket, USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await setUserWithdrawalManualControl(currentUser.id);
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C28634 (+) withdrawal_manual_control = true, withdrawal create', async () => {
      const { data } = await banking.withdrawalCreate(socket, WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      expect(data.confirmationRequested).equal(true);
    });

    it('C28635 (-) withdrawal_manual_control = true, withdrawal confirm', async () => {
      await banking.withdrawalCreate(socket, WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      await sleep(4000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).not.exist;
      expect(await banking.getWithdrawalStatus(currentUser.id)).equal(0);
    });

    it('C28636 (+) withdrawal_manual_control = true, transfer create', async () => {
      const { data } = await banking.transferCreate(socket, 100, 'RUB');
      // console.log(data);
      expect(data.confirmationRequested).equal(true);
    });

    it('C28637 (+) withdrawal_manual_control = true, deposit create', async () => {
      await banking.depositCreate(socket, WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      const res = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${currentUser.id} ;`);
      successDbDeposit(res, 100, WALLET, 'card_rub', 'RUB');
    });

    it('C28638 (+) withdrawal_manual_control = true, cases', async () => {
      const { data } = await cases.playCaseWithoutChance(socket, 1);
      // console.log(data);
      expect(data.result).above(0);
    });

    it('C28639 (+) withdrawal_manual_control = true, make bet', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);

      const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).equal(false);
      expect(betResponse[coupon.couponId].status).equal(200);
    });

    it('C28651 (-) withdrawal_manual_control = true, make bet > maxBetAmount', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(currentUser.id, maxBetAmount.RUB + 1);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount.RUB + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error.result).equal('rejected');
      expect(betResponse[coupon.couponId].error.messageLangKey).equal('riskmanagement.error.market_limit');
      expect(betResponse[coupon.couponId].status).equal(400);
    });
  });

  describe('withdrawal_manual_control = true + mail with auto confirm', () => {
    it('C28404 (+) withdrawal_manual_control = true + @mail withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail(socket);
      const { data: withdrawal } = await banking.withdrawalCreate(socket, '5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28405 (+) withdrawal_manual_control = true + @bk withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail(socket);
      const { data: withdrawal } = await banking.withdrawalCreate(socket, '5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28406 (+) withdrawal_manual_control = true + @inbox withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail(socket);
      await usersWithManualControl.userInbox(socket);
      const { data: withdrawal } = await banking.withdrawalCreate(socket, '5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28407 (+) withdrawal_manual_control = true + @list withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail(socket);
      const { data: withdrawal } = await banking.withdrawalCreate(socket, '5698548963217458', 'card_rub', 'RUB', 100);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });
  });

  describe('Anti - carding', () => {
    it('C1088636 - (+) withdrawal_manual_control = true after 2 failed deposits, new user', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '6363545498987171', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal('true');
    });

    it('C1088640 - (-) no withdrawal_manual_control after 1 failed deposit, new user', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '6363545498987171', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });

    it('C1315736 - (-) no withdrawal_manual_control after 2 failed deposits, old user', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);
      await banking.createWithdrawalInBD(user.id, 100, new Date(), 'card_rub', '6363454521218989', 1);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '6363545498987171', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });

    it('C1360990 - (-) no withdrawal_manual_control after 2 failed deposits, withdrawal on the same card', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '55005500663311220', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });

    it('C1360991 - (-) no withdrawal_manual_control after 2 failed deposits, withdrawal not on card', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '9112223344', 'mts_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });

    it('C1360992 - (-) no withdrawal_manual_control after deposits from different cards, withdrawal on one of them', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '55005500663311220', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });

    it('C1360993 - (+) withdrawal_manual_control = true after deposits from different cards, withdrawal on other card', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '5500220033669988', 'card_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal('true');
    });

    it('C1360994 - (-) no withdrawal_manual_control after deposits from different cards, withdrawal not on card', async () => {
      const { data: user } = await register.usualRegMailru(socket);
      // console.log(user.id);

      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '55005500663311220', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '9696585874741212', '2', 'payterra');
      await banking.createDepositInBD(user.id, 1000, new Date(), 'card_rub', '3344665588997700', '1', 'payterra');
      await banking.setBalance(user.id, 1000);

      const { data: caseResult } = await cases.playCaseWithoutChance(socket, 6);

      const { data } = await banking.withdrawalCreate(socket, '79112365498', 'mts_rub', 'RUB', caseResult.result);
      // console.log(data);
      expect(await getUserWithdrawalManualControl(user.id)).equal(undefined);
    });
  });
});
