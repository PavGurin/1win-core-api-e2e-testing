import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut, setUserCasesWinner, setUserWithdrawalBlock } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { userPool } from '../../src/methods/userPool';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { checkErrMsg } from '../../src/responseChecker';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';
import { successDbDeposit } from '../../src/expects/exDatabaseTests';
import { cases } from '../../src/methods/cases';

describe('Cases winner tests', () => {
  const WALLET = '1234965822365478';
  let currentUser = {};
  let users = [];

  describe('cases_winner = false', () => {
    it('C28427 (+) cases_winner = false by default and not present in socket.userMeta', async () => {
      const { data } = await register.oneClickReg(socket);
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.cases_winner).not.exist;
      const res = await mysqlConnection.executeQuery(`SELECT value FROM 1win.ma_users_meta where id_user= ${data.id} AND ma_users_meta.key = 'user_demo_withdrawal';`);
      expect(res[0]).not.exist;
    });
  });

  describe('cases_winner = true and withdrawal_block = false', () => {
    const USERS_NUMBER = 8;
    const BALANCE = 1000;

    beforeAll(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(socket, USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await setUserCasesWinner(currentUser.id);
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C28428 (+) cases_winner not present in socket.userMeta when in db = true', async () => {
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.cases_winner).not.exist;
    });

    it('C28441 (+) cases_winner = true + withdrawal_block = false, one case several times', async () => {
      const results = [];
      const caseCost = await cases.getCaseCost(1);
      for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await cases.playCaseWithoutChance(1);
        results.push(data.result);
      }
      // проверка, что хотя бы в одном случае выигрыш был меньше цены кейса
      expect(results.some(result => result < caseCost)).equal(true);
    });

    it('C28442 (+) cases_winner = true + withdrawal_block = false, several cases', async () => {
      const results = [];
      for (let i = 1; i < 6; i++) {
        // eslint-disable-next-line no-await-in-loop
        const caseCost = await cases.getCaseCost(i);
        // eslint-disable-next-line no-await-in-loop
        const { data } = await cases.playCaseWithoutChance(i);
        results.push(data.result < caseCost);
      }
      // проверка, что хотя бы в одном случае выигрыш был меньше цены кейса
      expect(results.some(result => result === true)).equal(true);
    });

    it('C28438 (+) cases_winner = true + withdrawal_block = false, withdrawal confirm', async () => {
      await banking.withdrawalCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      await sleep(4000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).not.exist;
    });

    it('C28439 (+) cases_winner = true + withdrawal_block = false, transfer create', async () => {
      const { data } = await banking.transferCreate(20, 'RUB');
      // console.log(data);
      expect(data.confirmationRequested).equal(true);
    });

    it('C28440 (+) cases_winner = true + withdrawal_block = false, deposit create', async () => {
      await banking.depositCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      const res = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${currentUser.id} ;`);
      successDbDeposit(res, 100, WALLET, 'card_rub', 'RUB');
    });

    it('C28653 (-) cases_winner = true + withdrawal_block = false, make bet > maxBetAmount', async () => {
      const { data: user } = await register.oneClickReg(socket);
      const [singleMatch] = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 'RUB', 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(user.id, maxBetAmount + 1);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error.result).equal('rejected');
      expect(betResponse[coupon.couponId].error.messageLangKey).equal('riskmanagement.error.market_limit');
      expect(betResponse[coupon.couponId].status).equal(400);
    });
  });

  describe('cases_winner = true and withdrawal_block = true', () => {
    const USERS_NUMBER = 9;
    const BALANCE = 10000;
    beforeAll(async () => {
      users = await userPool.usersWithBalanceRubAndConfirmCodes(socket, USERS_NUMBER, BALANCE);
    });

    beforeEach(async () => {
      await logOut();
      currentUser = users.pop();
      await setUserWithdrawalBlock(currentUser.id);
      await setUserCasesWinner(currentUser.id);
      await userList.loginWithParams(socket, currentUser.email, currentUser.password);
    });

    it('C28429 (+) cases_winner = true + withdrawal_block = true, case 1  (min cost 10 rub)', async () => {
      const caseCost = await cases.getCaseCost(1);
      const { data } = await cases.playCaseWithoutChance(1);
      // console.log(data);
      expect(data.result).above(caseCost);
    });

    it('C28430 (+) cases_winner = true + withdrawal_block = true, case 8 (max cost 10000 rub)', async () => {
      const caseCost = await cases.getCaseCost(8);
      const { data } = await cases.playCaseWithoutChance(8);
      // console.log(data);
      expect(data.result).above(caseCost);
    });

    it('C28431 (+) cases_winner = true + withdrawal_block = true, one case several times', async () => {
      const caseCost = await cases.getCaseCost(3);
      for (let i = 0; i < 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        const { data } = await cases.playCaseWithoutChance(3);
        // console.log(data);
        expect(data.result).above(caseCost);
      }
    });

    it('C28432 (+) cases_winner = true + withdrawal_block = true, several cases', async () => {
      for (let i = 1; i < 6; i++) {
        // eslint-disable-next-line no-await-in-loop
        const caseCost = await cases.getCaseCost(i);
        // eslint-disable-next-line no-await-in-loop
        const { data } = await cases.playCaseWithoutChance(i);
        // console.log(data);
        expect(data.result).above(caseCost);
      }
    });

    it('C28433 (-) withdrawal_block = true, withdrawal confirm', async () => {
      const { data } = await banking.withdrawalCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      await sleep(5000);
      const receivedMail = await mail.getMessage(currentUser.email);
      const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
      // console.log(confirm);
      expect(confirm.error).not.exist;
      expect(await banking.getWithdrawalStatus(currentUser.id)).equal(0);
    });

    it('C28434 (-) cases_winner = true + withdrawal_block = true, transfer create', async () => {
      const { data } = await banking.transferCreate(20, 'RUB');
      // console.log(data);
      expect(data.withdrawalBlocked).equal(true);
    });

    it('C28435 (-) cases_winner = true + withdrawal_block = true, deposit create', async () => {
      const { data } = await banking.depositCreate(100, WALLET, 'card_rub', 'RUB');
      // console.log(data);
      checkErrMsg(data, 400, 'Неверный запрос');
    });

    it('C28436 (+) cases_winner = true + withdrawal_block = true, make bet', async () => {
      const [singleMatch] = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);

      const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).equal(false);
      expect(betResponse[coupon.couponId].status).equal(200);
    });

    it('C28652 (+) cases_winner = true + withdrawal_block = true, make bet > maxBetAmount', async () => {
      const [singleMatch] = await getSingleMatch('prematch');
      // console.log(singleMatch);
      const coupon = await generateOrdinaryCoupon(singleMatch, 10);
      // console.log(coupon);
      const { data: { maxBetAmount } } = await getMaxBetAmount(coupon, singleMatch);
      // console.log(maxBetAmount);
      await banking.setBalance(currentUser.id, maxBetAmount + 1);

      const { data: betResponse } = await makeOrdinaryBet(coupon, maxBetAmount + 1);
      // console.log(betResponse);

      expect(betResponse[coupon.couponId].error).equal(false);
      expect(betResponse[coupon.couponId].status).equal(200);
    });
  });
});
