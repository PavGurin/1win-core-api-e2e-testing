/**
 * @jest-environment node
 */


import { register } from '../../src/methods/register';
import {
  setUserWithdrawalBlock, updateProfile,
// eslint-disable-next-line import/named
} from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { userPool } from '../../src/methods/userPool';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { checkErrMsg } from '../../src/responseChecker';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { usersWithBlock } from '../../src/methods/usersWithBlockAndManualControl';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { cases } from '../../src/methods/cases';

describe('Withdrawal block tests', () => {
  const WALLET = '5573631681598361';
  const USERS_NUMBER = 1;
  const BALANCE = 100;
  let currentUser = {};
  let users = [];

  describe('users with withdrawal_block = false', () => {
    it('C28398 (+) withdrawal_block = false by default', async () => {
      const { data } = await register.oneClickRegEUR();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_block).toEqual(false);
      const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta where id_user= ${data.id} AND ma_users_meta.key = 'withdrawal_block';`);
      expect(res[0]).toBeUndefined();
    });
    it('C28413 (+) withdrawal_block = false, cases', async () => {
      const { data: user } = await register.oneClickReg();
      await banking.setBalance(user.id);
      const { data } = await cases.playCaseWithoutChance(1);
      expect(data.result).toBeGreaterThanOrEqual(0);
    });
    it('C28648 (-) withdrawal_block = false, make bet > maxBetAmount', async () => {
      const { data: user } = await register.oneClickReg();
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(user.id, maxBetAmount.RUB + 10);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount.RUB + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error.result).toEqual('rejected');
      expect(betResponse[coupon.couponId].error.messageLangKey).toEqual('riskmanagement.error.market_limit_currency');
      expect(betResponse[coupon.couponId].status).toEqual(400);
    });
  });

  describe('users with withdrawal_block = true', () => {
    beforeEach(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await setUserWithdrawalBlock(currentUser.id);
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });
    it('C2025651 (+) withdrawal_block = true, save changes in settings', async () => {
      // const { data } = await updateProfile2(currentUser.password);
      const { data } = await updateProfile({
        password: currentUser.password,
      });
      checkErrMsg(data, 500, 'Internal Server Error');
    });
    it('C28399 (+) withdrawal_block = false when in db = true', async () => {
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).toEqual(false);
    });

    it('C28400 (+) withdrawal_block = true, withdrawal create', async () => {
      const { data } = await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      expect(data.confirmationRequested).toEqual(true);
    });

    it('C28401 (-) withdrawal_block = true, withdrawal confirm', async () => {
      await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      await sleep(10000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).toBeUndefined();
      expect(await banking.getWithdrawalStatus(currentUser.id)).toEqual(0);
    });

    it('C28402 (-) withdrawal_block = true, transfer create', async () => {
      const { data } = await banking.transferCreate(100, 'RUB');
      // console.log(data);
      expect(data.withdrawalBlocked).toEqual(true);
    });

    it('C28403 (-) withdrawal_block = true, deposit create', async () => {
      const { data } = await banking.depositCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('C28412 (-) withdrawal_block = true, cases', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      // console.log(data);
      checkErrMsg(data, 400, 'demo are forbidden');
    });

    it('C28414 (+) withdrawal_block = true, make bet', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);

      const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).toEqual(false);
      expect(betResponse[coupon.couponId].status).toEqual(200);
    });

    it('C28647 (+) withdrawal_block = true, make bet > maxBetAmount', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(currentUser.id, maxBetAmount.RUB + 10);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount.RUB + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).toEqual(false);
      expect(betResponse[coupon.couponId].status).toEqual(200);
    });
  });

  describe('mail with auto confirm', () => {
    it('C28408 (-) withdrawal_block = true + @mail withdrawal', async () => {
      const { data } = await register.usualRegMailru();
      await banking.createDepositInBD(data.id, 'RUB', 500);
      await banking.setBalance(data.id, 500);
      const { data: { result } } = await cases.playCaseWithoutChance(4);
      // console.log(result);
      await setUserWithdrawalBlock(data.id);
      const { data: withdrawal } = await banking.withdrawalCreate('5404367567655984', 'card_rub', 'RUB', result);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28409 (-) withdrawal_block = true + @bk withdrawal', async () => {
      const { data } = await register.usualRegBkru();
      await banking.createDepositInBD(data.id, 'RUB', 500);
      await banking.setBalance(data.id, 500);
      const { data: { result } } = await cases.playCaseWithoutChance(4);
      // console.log(result);
      await setUserWithdrawalBlock(data.id);
      const { data: withdrawal } = await banking.withdrawalCreate('5404367567655984', 'card_rub', 'RUB', result);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28410 (-) withdrawal_block = true + @inbox withdrawal', async () => {
      const { data } = await register.usualRegInboxru();
      await banking.createDepositInBD(data.id, 'RUB', 500);
      await banking.setBalance(data.id, 500);
      const { data: { result } } = await cases.playCaseWithoutChance(4);
      // console.log(result);
      await setUserWithdrawalBlock(data.id);
      const { data: withdrawal } = await banking.withdrawalCreate('5404367567655984', 'card_rub', 'RUB', result);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });

    it('C28411 (-) withdrawal_block = true + @list withdrawal', async () => {
      const { data } = await register.usualRegListru();
      await banking.createDepositInBD(data.id, 'RUB', 500);
      await banking.setBalance(data.id, 500);
      const { data: { result } } = await cases.playCaseWithoutChance(4);
      // console.log(result);
      await setUserWithdrawalBlock(data.id);
      const { data: withdrawal } = await banking.withdrawalCreate('5404367567655984', 'card_rub', 'RUB', result);
      // console.log(withdrawal);
      expect(withdrawal.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(data.id)).toEqual(0);
    });
  });
});
