import { userPool } from '../../src/methods/userPool';
import { setUserWithdrawalManualControl } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { sleep } from '../../src/methods/utils';
import { mail } from '../../src/methods/mail';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../src/expects/exDatabaseTests';
import { cases } from '../../src/methods/cases';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, getMaxBetAmount, makeOrdinaryBet } from '../../src/methods/better';

describe('users with withdrawal_manual_control = true', () => {
  const WALLET = '2552699635580001';
  const USERS_NUMBER = 1;
  const BALANCE = 100;
  let currentUser = {};
  let users = [];

  beforeEach(async () => {
    users = await userPool.usersWithBalanceRubAndConfirmCodes(USERS_NUMBER, BALANCE);
    currentUser = users.pop();
    await setUserWithdrawalManualControl(currentUser.id);
    await userList.loginWithParams(currentUser.email, currentUser.password);
  });

  it('C28634 (+) withdrawal_manual_control = true, withdrawal create', async () => {
    const { data } = await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
  });

  it('C28635 (-) withdrawal_manual_control = true, withdrawal confirm', async () => {
    const ban = await banking.withdrawalCreate(WALLET, 'card_rub', 'RUB', 100);
    // console.log(ban);
    await sleep(4000);
    const receivedMail = await mail.getMessage(currentUser.email);
    const { data: confirm } = await socket.send('BANKING:withdrawal-confirm', { code: receivedMail.code });
    // console.log(confirm);
    expect(confirm.error).toBeUndefined();
    expect(await banking.getWithdrawalStatus(currentUser.id)).toEqual(0);
  });

  it('C28636 (+) withdrawal_manual_control = true, transfer create', async () => {
    const { data } = await banking.transferCreate(100, 'RUB');
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
  });

  it('C28637 (+) withdrawal_manual_control = true, deposit create', async () => {
    const ban = await banking.depositCreate(WALLET, 'card_rub', 'RUB', 100);
    // console.log(ban);
    const res = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${currentUser.id} ;`);
    successDbDeposit(res, 100, WALLET, 'card_rub', 'RUB');
  });

  it('C28638 (+) withdrawal_manual_control = true, cases', async () => {
    const { data } = await cases.playCaseWithoutChance(1);
    // console.log(data);
    expect(data.result).toBeGreaterThanOrEqual(0);
  });

  it('C28639 (+) withdrawal_manual_control = true, make bet', async () => {
    const singleMatch = await getSingleMatch('prematch');
    // console.log(singleMatch);
    const coupon = await generateOrdinaryCoupon(singleMatch, 10);
    // console.log(coupon);

    const { data: betResponse } = await makeOrdinaryBet(coupon, 10);
    // console.log(betResponse);

    expect(betResponse[coupon.couponId].error).toEqual(false);
    expect(betResponse[coupon.couponId].status).toEqual(200);
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

    expect(betResponse[coupon.couponId].error.result).toEqual('rejected');
    expect(betResponse[coupon.couponId].error.messageLangKey).toEqual('riskmanagement.error.market_limit');
    expect(betResponse[coupon.couponId].status).toEqual(400);
  });
});
