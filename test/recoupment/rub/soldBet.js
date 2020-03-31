import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { cases } from '../../../src/methods/cases';
import { sleep } from '../../../src/methods/utils';
import { addSoldBetToBD } from '../../../src/methods/betsInBD';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

describe('Sold bets tests', () => {
  const DEPOSIT_AMOUNT = 1000;
  const FIVE_HUNDRED_ROUBLES_CASE_ID = 4;
  const HUNDRED_ROUBLES_CASE_ID = 3;

  describe('Sold bet coeff > 1.1, sold bet profit < bet amount', () => {
    const coeff = 1.2;
    const betSoldPrice = (DEPOSIT_AMOUNT / 1.2).toFixed(2);
    let user;

    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await addSoldBetToBD(user.id, 'RUB', DEPOSIT_AMOUNT, betSoldPrice, coeff);
      await banking.setBalance(user.id, betSoldPrice);
      await sleep(2000);
    });

    it('C2064568 (-) one deposit, bet sold + the rest of money not spent', async () => {
      // депозит + проданная ставка, вывод невозможен
      await checkRecoupment(betSoldPrice, false);
    });

    it('C2064569 (-) one deposit, bet sold + part of money spent', async () => {
      // депозит, проданная ставка, часть денег с проданной ставки отыграна
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064473 (+) one deposit, bet sold + the rest of money spent', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // вывод возможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });

    it('C2064470 (-) one deposit, bet sold, the rest of money spent + another deposit', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // сделан новый депозит
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(2000);
      await checkRecoupment(balance + 100, false);
    });

    it('C2064471 (+) one deposit, bet sold, the rest of money spent , another deposit is spent', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // сделан новый депозит, он отыгран
      // вывод возможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      let balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(balance + 100);
      await sleep(1500);
      await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });
  });

  describe('Sold bet coeff > 1.1, sold bet profit > bet amount', () => {
    const coeff = 1.2;
    const betSoldPrice = (DEPOSIT_AMOUNT * 1.1).toFixed(2);
    let user;

    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await addSoldBetToBD(user.id, 'RUB', DEPOSIT_AMOUNT, betSoldPrice, coeff);
      await banking.setBalance(user.id, betSoldPrice);
      await sleep(2000);
    });

    it('C2064570 (-) one deposit, bet sold + the rest of money not spent', async () => {
      // депозит + проданная ставка, вывод невозможен
      await checkRecoupment(betSoldPrice, false);
    });

    it('C2064571 (-) one deposit, bet sold + part of money spent', async () => {
      // депозит, проданная ставка, часть денег с проданной ставки отыграна
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064572 (+) one deposit, bet sold + deposit amount spent', async () => {
      // депозит, проданная ставка, отыграны деньги в размере депозита
      // вывод возможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });

    it('C2064573 (-) one deposit, bet sold, deposit amount spent + another deposit', async () => {
      // депозит, проданная ставка,  отыграны деньги в размере депозита
      // сделан новый депозит
      // вывод невозможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(2000);
      await checkRecoupment(balance + 100, false);
    });

    it('C2064574 (+) one deposit, bet sold, deposit amount spent , another deposit is spent', async () => {
      // депозит, проданная ставка, отыграны деньги в размере депозита
      // сделан новый депозит, он отыгран
      // вывод возможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      let balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(1500);
      await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });
  });

  describe('Sold bet coeff = 1.1, sold bet profit < bet amount', () => {
    const coeff = 1.1;
    const betSoldPrice = (DEPOSIT_AMOUNT / 1.2).toFixed(2);
    let user;

    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await addSoldBetToBD(user.id, 'RUB', DEPOSIT_AMOUNT, betSoldPrice, coeff);
      await banking.setBalance(user.id, betSoldPrice);
      await sleep(2000);
    });

    it('C2064579 (-) one deposit, bet sold + the rest of money not spent', async () => {
      // депозит + проданная ставка, вывод невозможен
      await checkRecoupment(betSoldPrice, false);
    });

    it('C2064580 (-) one deposit, bet sold + part of money spent', async () => {
      // депозит, проданная ставка, часть денег с проданной ставки отыграна
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064581 (+) one deposit, bet sold + the rest of money spent', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // вывод возможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });

    it('C2064582 (-) one deposit, bet sold, the rest of money spent + another deposit', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // сделан новый депозит
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(2000);
      await checkRecoupment(balance + 100, false);
    });

    it('C2064583 (+) one deposit, bet sold, the rest of money spent , another deposit is spent', async () => {
      // депозит, проданная ставка, деньги с проданной ставки отыграны
      // сделан новый депозит, он отыгран
      // вывод возможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      let balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(1500);
      await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      balance = await banking.balanceCheck();
      // без задержки работать не будет
      await sleep(2000);
      await checkRecoupment(balance, true);
    });
  });

  describe('Sold bet coeff = 1.1, sold bet profit > bet amount', () => {
    const coeff = 1.1;
    const betSoldPrice = (DEPOSIT_AMOUNT * 1.1).toFixed(2);
    let user;

    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await addSoldBetToBD(user.id, 'RUB', DEPOSIT_AMOUNT, betSoldPrice, coeff);
      await banking.setBalance(user.id, betSoldPrice);
      await sleep(2000);
    });

    it('C2064584 (-) one deposit, bet sold + the rest of money not spent', async () => {
      // депозит + проданная ставка, вывод невозможен
      await checkRecoupment(betSoldPrice, false);
    });

    it('C2064585 (-) one deposit, bet sold + part of money spent', async () => {
      // депозит, проданная ставка, часть денег с проданной ставки отыграна
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064586 (+) one deposit, bet sold + deposit amount spent', async () => {
      // депозит, проданная ставка, отыграны деньги в размере депозита
      // вывод возможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });

    it('C2064587 (-) one deposit, bet sold, deposit amount spent + another deposit', async () => {
      // депозит, проданная ставка,  отыграны деньги в размере депозита
      // сделан новый депозит
      // вывод невозможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(2000);
      await checkRecoupment(balance + 100, false);
    });

    it('C2064588 (+) one deposit, bet sold, deposit amount spent , another deposit is spent', async () => {
      // депозит, проданная ставка, отыграны деньги в размере депозита
      // сделан новый депозит, он отыгран
      // вывод возможен
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      let balance = await banking.balanceCheck();
      await banking.createDepositInBD(user.id, 'RUB', 100);
      await banking.setBalance(user.id, balance + 100);
      await sleep(1500);
      await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });
  });

  describe('Sold bet coeff < 1.1', () => {
    const coeff = 1.09;
    const betSoldPrice = (DEPOSIT_AMOUNT / 1.2).toFixed(2);
    let user;

    beforeEach(async () => {
      const { data } = await register.oneClickReg();
      user = data;
      // console.log(user);
      await banking.createDepositInBD(user.id, 'RUB', DEPOSIT_AMOUNT);
      await addSoldBetToBD(user.id, 'RUB', DEPOSIT_AMOUNT, betSoldPrice, coeff);
      await banking.setBalance(user.id, betSoldPrice);
      await sleep(2000);
    });

    it('C2064575 (-) one deposit, bet sold + the rest of money not spent', async () => {
      // депозит + проданная ставка, вывод невозможен
      await checkRecoupment(betSoldPrice, false);
    });

    it('C2064576 (-) one deposit, bet sold + part of money spent', async () => {
      // депозит, проданная ставка, часть денег с проданной ставки отыграна
      // вывод невозможен
      await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064577 (-) one deposit, bet sold + sold bet amount spent', async () => {
      // депозит, проданная ставка, отыграна сумма продажи ставки
      // вывод невозможен
      await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      for (let i = 0; i < 4; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, false);
    });

    it('C2064578 (+) one deposit, bet sold + deposit amount spent', async () => {
      // депозит, проданная ставка, отыгран депозит
      // вывод невозможен
      await banking.setBalance(user.id, DEPOSIT_AMOUNT);
      for (let i = 0; i < 2; i++) {
        // eslint-disable-next-line no-await-in-loop
        await cases.playCaseWithChance(FIVE_HUNDRED_ROUBLES_CASE_ID);
      }
      const balance = await banking.balanceCheck();
      await sleep(2000);
      await checkRecoupment(balance, true);
    });
  });
});
