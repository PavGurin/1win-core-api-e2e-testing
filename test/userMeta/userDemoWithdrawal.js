/**
 * @jest-environment node
 */


import { register } from '../../src/methods/register';
import { setUserDemoWithdrawal, setUserWithdrawalBlock } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { userPool } from '../../src/methods/userPool';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { checkErrMsg } from '../../src/responseChecker';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { successDbDeposit } from '../../src/expects/exBanking';
import { cases } from '../../src/methods/cases';

describe('User demo withdrawal tests', () => {
  const WALLET = '4179554079764315';
  let currentUser = {};
  let users = [];

  describe('user_demo_withdrawal = false', () => {
    it('C28415 (+) user_demo_withdrawal = false by default', async () => {
      const { data } = await register.oneClickReg();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.user_demo_withdrawal).toEqual(false);
      const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta where id_user= ${data.id} AND ma_users_meta.key = 'user_demo_withdrawal';`);
      expect(res[0]).toBeUndefined();
    });
  });

  describe('user_demo_withdrawal = true and withdrawal_block = false', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 100;

    beforeEach(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await setUserDemoWithdrawal(currentUser.id);
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C28422 (+) user_demo_withdrawal = true +  withdrawal_block = false, withdrawal create', async () => {
      const { data } = await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      expect(data.confirmationRequested).toEqual(true);
    });

    // ????????, ??.?? ???? ?????????????? ???? ???????????????????????? ????????????
    it.skip('C28423 (+) user_demo_withdrawal = true + withdrawal_block = false, withdrawal confirm', async () => {
      await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      await sleep(10000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).toBeUndefined();
    });

    it('C28424 (+) user_demo_withdrawal = true + withdrawal_block = false, transfer create', async () => {
      const { data } = await banking.transferCreate(20, 'RUB');
      // console.log(data);
      expect(data.confirmationRequested).toEqual(true);
    });

    it('C28425 (+) user_demo_withdrawal = true + withdrawal_block = false, deposit create', async () => {
      await banking.depositCreate(WALLET, 'card_rub', 'RUB', 100);
      await successDbDeposit(currentUser.id, 100, WALLET, 'card_rub', 'RUB');
    });

    it('C28426 (+) user_demo_withdrawal = true + withdrawal_block = false, cases', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      expect(data.result).toBeGreaterThanOrEqual(0);
    });

    it('C28650 (-) user_demo_withdrawal = true + withdrawal_block = false, make bet > maxBetAmount', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(currentUser.id, maxBetAmount.RUB + 10);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount.RUB + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error.result).toEqual('rejected');
      expect(betResponse[coupon.couponId].error.messageLangKey).toEqual('riskmanagement.error.market_limit_currency');
      expect(betResponse[coupon.couponId].status).toEqual(400);
    });
  });

  describe('user_demo_withdrawal = true and withdrawal_block = true', () => {
    const USERS_NUMBER = 1;
    const BALANCE = 100;
    beforeEach(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
      currentUser = users.pop();
      await setUserWithdrawalBlock(currentUser.id);
      await setUserDemoWithdrawal(currentUser.id);
      await userList.loginWithParams(currentUser.email, currentUser.password);
    });

    it('C28416 (+) user_demo_withdrawal = false when in db = true', async () => {
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.withdrawal_manual_control).toEqual(false);
    });

    it('C28417 (+) user_demo_withdrawal = true + withdrawal_block = true, withdrawal create', async () => {
      const { data } = await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      expect(data.confirmationRequested).toEqual(false);
      expect(await banking.getWithdrawalStatus(currentUser.id)).toEqual(1);
    });

    it('C28418 (-) user_demo_withdrawal = true + withdrawal_block = true, transfer create', async () => {
      const { data } = await banking.transferCreate(20, 'RUB');
      // console.log(data);
      expect(data.withdrawalBlocked).toEqual(true);
    });

    it('C28419 (-) user_demo_withdrawal = true + withdrawal_block = true, deposit create', async () => {
      const { data } = await banking.depositCreate(WALLET, 'card_rub', 'RUB', 100);
      // console.log(data);
      checkErrMsg(data, 400, '???????????????? ????????????');
    });

    it('C28420 (-) user_demo_withdrawal = true + withdrawal_block = true, cases', async () => {
      const { data } = await cases.playCaseWithoutChance(1);
      // console.log(data);
      checkErrMsg(data, 400, 'demo are forbidden');
    });

    it('C28421 (+) user_demo_withdrawal = true + withdrawal_block = true, make bet', async () => {
      const singleMatch = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);

      const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).toEqual(false);
      expect(betResponse[coupon.couponId].status).toEqual(200);
    });

    it('C28649 (+) user_demo_withdrawal = true + withdrawal_block = true, make bet > maxBetAmount', async () => {
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
});
