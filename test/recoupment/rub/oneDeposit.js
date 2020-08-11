import { userPool } from '../../../src/methods/userPool';
import { userList } from '../../../src/methods/userList';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { checkRecoupment } from '../../../src/expects/exRecoupment';
import { register } from '../../../src/methods/register';

// юзеры с одним депозитом
describe('One deposit', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  const HUNDRED_ROUBLES_CASE_ID = 3;
  const FIFTY_ROUBLES_CASE_ID = 1;
  const USERS_NUMBER = 1;
  const DEPOSIT_AMOUNT = 100;
  let users = [];
  let currentUser = {};

  beforeEach(async () => {
    users = await userPool.usersWithDepositRub(USERS_NUMBER, DEPOSIT_AMOUNT);
    // console.log(users);
    currentUser = users.pop();
    await userList.loginWithParams(currentUser.email, currentUser.password);
    // console.log(currentUser);
    await sleep(2000);
  });

  it('C1021290 - (-) nothing spent, withdraw money', async () => {
    await checkRecoupment(currentUser.balance, false);
  });

  it('C1021291 - (-) spent part of deposit, withdraw money', async () => {
    const { data } = await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment(DEPOSIT_AMOUNT - 10 + data.result, false);
  });

  it('C1021292 - (+) spent all money, withdraw amount < balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment(data.result, true);
  });

  it('C1021293 - (-) spent all money, withdraw amount > balance', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    // console.log(data);
    await sleep(2000);
    await checkRecoupment('10000', '403');
  });

  it('C1022178 - (+) spent all money, cases played several times, withdraw amount < balance', async () => {
    await sleep(1000);
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);
    await cases.playCaseWithoutChance(FIFTY_ROUBLES_CASE_ID);
    await sleep(2000);
    await checkRecoupment(10, true);
  });

  it('C1086873 - (+) deposit + case + withdrawal, withdraw again', async () => {
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2000);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    await sleep(2000);
    await checkRecoupment(data.result / 2, true);
  });

  it('C1090487 - (-) deposit + case + withdrawal + new deposit, withdraw again', async () => {
    // console.log(currentUser.email, currentUser.password);
    const { data } = await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2000);
    await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', data.result / 2);
    await sleep(2000);
    await banking.createDepositInBD(currentUser.id, 'RUB', 100, new Date(), 'mts_rub', '9111223366', 1);
    await sleep(2000);
    await checkRecoupment(data.result / 2, false);
  });
});

// для проверки в админке
describe.skip('tests', () => {
  /* eslint no-console:off */
  it('test 1', async () => {
    const { data: user } = await register.oneClickReg();
    console.log({ id: user.id, email: user.email, pass: user.password });

    await banking.createDepositInBD(user.id, 'RUB', 70);
    await banking.setBalance(user.id, 70);
    await sleep(1500);
    const { data: { result: case1 } } = await cases.playCaseWithoutChance(1); // 50 rub
    // recoup 20

    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', 100);
    await banking.setBalance(user.id, 70 - 50 + case1 + 100);
    await sleep(1500);
    const { data: { result: case2 } } = await cases.playCaseWithoutChance(1); // 50 rub
    // first dep recouped, second recoup 70

    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', 100);
    await banking.setBalance(user.id, 70 - 100 + 200 + case1 + case2);
    await sleep(1500);
    const { data: { result: case3 } } = await cases.playCaseWithoutChance(1); // 50 rub
    // first dep recouped, second recoup 20, third recoup 100
    // result = 120
    console.log('result = 120');
  });

  it('test2', async () => {
    const { data: user } = await register.oneClickReg();
    console.log({ id: user.id, email: user.email, pass: user.password });

    await banking.createDepositInBD(user.id, 'RUB', 100);
    await banking.setBalance(user.id, 100);
    await sleep(1500);
    const { data: { result: case11 } } = await cases.playCaseWithoutChance(1); // 50 rub
    const { data: { result: case12 } } = await cases.playCaseWithoutChance(1); // 50 rub
    const { data: { result: case13 } } = await cases.playCaseWithoutChance(2); // 20 rub
    // recouped

    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', 100);
    await banking.setBalance(user.id, 70 - 120 + 100 + case11 + case12 + case13);
    await sleep(1500);
    const { data: { result: case21 } } = await cases.playCaseWithoutChance(1); // 50 rub
    const { data: { result: case22 } } = await cases.playCaseWithoutChance(1); // 50 rub
    const { data: { result: case23 } } = await cases.playCaseWithoutChance(2); // 20 rub
    // recouped

    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', 40);
    await banking.setBalance(user.id, 70 - 120 - 120 + 100 + 40
        + case11 + case12 + case13 + case21 + case22 + case23);
    await sleep(1500);
    const { data: { result: case3 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // third recoup 30
    // result = 30
    console.log('result = 30');
  });

  it('test3', async () => {
    const { data: user } = await register.oneClickReg();
    console.log({ id: user.id, email: user.email, pass: user.password });

    await banking.createDepositInBD(user.id, 'RUB', 37.5);
    await banking.setBalance(user.id, 37.5);
    await sleep(1500);
    const { data: { result: case11 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // recouped 10, 27.5 left
    await banking.createDepositInBD(user.id, 'RUB', 11.2);
    await banking.setBalance(user.id, 37.5 + 11.2 - 10 + case11);

    await sleep(1500);
    const { data: { result: case12 } } = await cases.playCaseWithoutChance(2); // 20 rub
    // first recouped 30, 7.5 left; second not recouped

    await sleep(1500);
    const { data: { result: case13 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // fisrt recouped, second recouped 2.5, 8.7 left

    // result = 8.7
    console.log('result = 8.7');
  });

  it('test4', async () => {
    const { data: user } = await register.oneClickReg();
    console.log({ id: user.id, email: user.email, pass: user.password });

    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', 500);
    await banking.createDepositInBD(user.id, 'RUB', 37.5);
    await banking.setBalance(user.id, 37.5);
    await sleep(1500);
    const { data: { result: case11 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // recouped 10, 27.5 left
    await banking.createDepositInBD(user.id, 'RUB', 11.2);
    await banking.setBalance(user.id, 37.5 + 11.2 - 10 + case11);

    await sleep(1500);
    const { data: { result: case12 } } = await cases.playCaseWithoutChance(2); // 20 rub
    // first recouped 30, 7.5 left; second not recouped

    await sleep(1500);
    const { data: { result: case13 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // fisrt recouped, second recouped 2.5, 8.7 left

    // result = 8.7
    console.log('result = 8.7');
  });

  it('test5', async () => {
    const { data: user } = await register.oneClickReg();
    console.log({ id: user.id, email: user.email, pass: user.password });

    await banking.createDepositInBD(user.id, 'RUB', 37.5);
    await banking.setBalance(user.id, 37.5);
    await sleep(1500);
    const { data: { result: case11 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // recouped 10, 27.5 left

    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', 500);
    await banking.createDepositInBD(user.id, 'RUB', 11.2);
    await banking.setBalance(user.id, 37.5 + 11.2 - 10 + case11);

    await sleep(1500);
    const { data: { result: case12 } } = await cases.playCaseWithoutChance(2); // 20 rub
    // first recouped 30, 7.5 left; second not recouped

    await sleep(1500);
    const { data: { result: case13 } } = await cases.playCaseWithoutChance(5); // 10 rub
    // fisrt recouped, second recouped 2.5, 8.7 left

    // result = 8.7
    console.log('result = 8.7');
  });
});
