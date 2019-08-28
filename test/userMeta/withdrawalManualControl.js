import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut, setUserWithdrawalManualControl } from '../../src/methods/user';
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

describe('Withdrawal manual control tests', () => {
  const BLOCKED_WALLET = '9898777766668989';

  describe('users with no withdrawal_manual_control', () => {
    beforeEach(async () => { await logOut(); });

    it('C28385 (+) withdrawal_manual_control = false by default', async () => {
      await register.oneClickReg();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).equal(false);
    });

    it('C28386 (+) withdrawal_manual_control = false when in db = true', async () => {
      const { data } = await register.usualReg();
      await setUserWithdrawalManualControl(data.id);
      await logOut();
      await userList.loginWithParams(data.email, data.password);
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).equal(false);
    });

    it('C28387 (+) withdrawal_manual_control = true in db after withdrawal to blocked wallet', async () => {
      const { data: user } = await register.usualReg();
      // console.log(currentUser.id);
      await banking.setBalance(user.id);
      const { data: withdrawal } = await banking.withdrawalCreate(200, BLOCKED_WALLET, 'card_rub', 'RUB');
      // console.log(withdrawal);

      const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta where id_user= ${user.id} AND ma_users_meta.key = 'withdrawal_manual_control';`);
      // console.log(res);
      expect(res[0].value).equal('true');
    });

    it('C28388 (+) withdrawal_manual_control = true in db after deposit from blocked wallet', async () => {
      const { data: user } = await register.usualReg();
      // console.log(currentUser.id);

      const { data: deposit } = await banking.depositCreateRub(200, BLOCKED_WALLET, 'card_rub', 'RUB');
      expect(deposit.status).equal(500);
      expect(deposit.message).equal('Internal Server Error');
      // console.log(deposit);

      const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta where id_user= ${user.id} AND ma_users_meta.key = 'withdrawal_manual_control';`);
      // console.log(res);
      expect(res[0].value).equal('true');
    });
  });

  describe('users with withdrawal_manual_control = true', () => {
    const WALLET = '2552699635580001';
    const USERS_NUMBER = 7;
    const BALANCE = 100;
    let currentUser = {};
    let users = [];

    beforeAll(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await setUserWithdrawalManualControl(currentUser.id);
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C28634 (+) withdrawal_manual_control = true, withdrawal create', async () => {
      const { data } = await banking.withdrawalCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      expect(data.confirmationRequested).equal(true);
    });

    it('C28635 (-) withdrawal_manual_control = true, withdrawal confirm', async () => {
      const { data } = await banking.withdrawalCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      await sleep(4000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).not.exist;
      expect(await banking.getWithdrawalStatus(currentUser.id)).equal(0);
    });

    it('C28636 (+) withdrawal_manual_control = true, transfer create', async () => {
      const { data } = await banking.transferCreate(100, 'RUB');
      // console.log(data);
      expect(data.confirmationRequested).equal(true);
    });

    it('C28637 (+) withdrawal_manual_control = true, deposit create', async () => {
      const { data } = await banking.depositCreateRub(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      const res = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${currentUser.id} ;`);
      successDbDeposit(res, 100, WALLET, 'card_rub', 'RUB');
    });

    it('C28638 (+) withdrawal_manual_control = true, cases', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      // console.log(data);
      expect(data.result).above(0);
    });

    it('C28639 (+) withdrawal_manual_control = true, make bet', async () => {
      const [singleMatch] = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);

      const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).equal(false);
      expect(betResponse[coupon.couponId].status).equal(200);
    });

    it('C28651 (-) withdrawal_manual_control = true, make bet > maxBetAmount', async () => {
      const [singleMatch] = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(currentUser.id, maxBetAmount + 1);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error.result).equal('rejected');
      expect(betResponse[coupon.couponId].error.messageLangKey).equal('riskmanagement.error.market_limit');
      expect(betResponse[coupon.couponId].status).equal(400);
    });
  });

  describe('withdrawal_manual_control = true + mail with auto confirm', () => {
    it('C28404 (+) withdrawal_manual_control = true + @mail withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate(100, '5698548963217458', 'card_rub', 'RUB');
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28405 (+) withdrawal_manual_control = true + @bk withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate(100, '5698548963217458', 'card_rub', 'RUB');
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28406 (+) withdrawal_manual_control = true + @inbox withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      await usersWithManualControl.userInbox();
      const { data: withdrawal } = await banking.withdrawalCreate(100, '5698548963217458', 'card_rub', 'RUB');
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });

    it('C28407 (+) withdrawal_manual_control = true + @list withdrawal', async () => {
      const { data } = await usersWithManualControl.userMail();
      const { data: withdrawal } = await banking.withdrawalCreate(100, '5698548963217458', 'card_rub', 'RUB');
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).equal(false);
      expect(await banking.getWithdrawalStatus(data.id)).equal(0);
    });
  });
});
