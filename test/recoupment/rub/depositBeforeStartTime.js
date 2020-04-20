import { register } from '../../../src/methods/register';
import { setUserRegisterDate } from '../../../src/methods/user';
import { banking } from '../../../src/methods/banking';
import { checkRecoupment } from '../../../src/expects/exRecoupment';
import { sleep } from '../../../src/methods/utils';
import { cases } from '../../../src/methods/cases';

// recoup starts from 2020-04-16 12:14:35
const BEFORE_START_TIME = new Date('2020-04-16 12:00:00');
const REG_TIME = '2019-09-19 00:00:01';
const HUNDRED_ROUBLES_CASE_ID = 3;
const depositAmount = 100;

describe('Deposit before start time', () => {
  it('C2092496 (+) deposit before start time not recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.setBalance(user.id, depositAmount);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
  it('C2092498 (+) several deposits before start time not recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 2, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 3, BEFORE_START_TIME);
    await banking.setBalance(user.id, depositAmount * 6);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
  it('C2092497 (+) deposit before start time recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.setBalance(user.id, depositAmount);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
  it('C2092499 (-) deposit before start time + deposit after start time not recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.setBalance(user.id, depositAmount);
    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount);
    await sleep(2500);
    await checkRecoupment('10', false);
  });
  it('C2092500 (+) deposit before start time + deposit after start time recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.setBalance(user.id, depositAmount);
    await sleep(1500);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 2);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
  it('C2092501 (-) several deposits before start time  + deposit after start time not recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 2, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 3, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 7);
    await sleep(2500);
    await checkRecoupment('10', false);
  });
  it('C2092502 (+) several deposits before start time  + deposit after start time recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 2, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 3, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 7);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
  it('C2092503 (-) several deposits before start time  +  2 deposits after start time, one recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 2, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 3, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 7);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 8);
    await sleep(2500);
    await checkRecoupment('10', false);
  });
  it('C2092504 (+) several deposits before start time  +  2 deposits after start time, both recouped', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, REG_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 2, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount * 3, BEFORE_START_TIME);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 7);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date());
    await banking.setBalance(user.id, depositAmount * 8);
    await sleep(1500);
    await cases.playCaseWithoutChance(HUNDRED_ROUBLES_CASE_ID);
    await sleep(2500);
    await checkRecoupment('10', true);
  });
});
