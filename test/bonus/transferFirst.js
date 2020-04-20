import { banking } from '../../src/methods/banking';

import { register } from '../../src/methods/register';
import { changeCurrency, setUserBonusAmount } from '../../src/methods/user';
import { makeSuccessfulOrdinaryBet } from '../../src/methods/betsInBD';
import { checkBonus } from '../../src/expects/exBonus';

describe('First deposit is a transfer', () => {
  it('C1789800 (+) transfer, deposit & bet have all same currency', async () => {
    const coeff = 4.9;
    const TRANSFER_AMOUNT = 150;
    const FIRST_DEPOSIT_AMOUNT = 5000;
    const BET_AMOUNT = 100;

    const { data: user } = await register.oneClickReg();
    await banking.createTransferInBD(user.id, 'RUB', TRANSFER_AMOUNT, new Date(), 1, 136);
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', BET_AMOUNT, coeff);
    await checkBonus(user.id, bet, FIRST_DEPOSIT_AMOUNT - BET_AMOUNT * 0.05,
      BET_AMOUNT * 0.05, BET_AMOUNT * coeff);
  });


  it('C1789801 (+) transfer = USD, deposit & bet = RUB', async () => {
    const coeff = 4.9;
    const TRANSFER_AMOUNT = 150;
    const FIRST_DEPOSIT_AMOUNT = 5000;
    const BET_AMOUNT = 100;

    const { data: user } = await register.oneClickReg();
    await banking.createTransferInBD(user.id, 'USD', TRANSFER_AMOUNT, new Date(), 1, 136);
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', BET_AMOUNT, coeff);
    await checkBonus(user.id, bet, FIRST_DEPOSIT_AMOUNT - BET_AMOUNT * 0.05,
      BET_AMOUNT * 0.05, BET_AMOUNT * coeff);
  });

  it('C1789802 (-) transfer & bet = USD, deposit  = RUB', async () => {
    const coeff = 4.9;
    const TRANSFER_AMOUNT = 150;
    const FIRST_DEPOSIT_AMOUNT = 5000;
    const BET_AMOUNT = 100;

    const { data: user } = await register.oneClickReg();
    await banking.createTransferInBD(user.id, 'USD', TRANSFER_AMOUNT, new Date(), 1, 136);
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('USD');
    const bet = await makeSuccessfulOrdinaryBet(user, 'USD', BET_AMOUNT, coeff);
    await checkBonus(user.id, bet, FIRST_DEPOSIT_AMOUNT,
      0, BET_AMOUNT * coeff);
  });


  it('C1789803 (-) transfer & first deposit = RUB, bet = USD', async () => {
    const coeff = 4.9;
    const TRANSFER_AMOUNT = 150;
    const FIRST_DEPOSIT_AMOUNT = 5000;
    const BET_AMOUNT = 100;

    const { data: user } = await register.oneClickReg();
    await banking.createTransferInBD(user.id, 'RUB', TRANSFER_AMOUNT, new Date(), 1, 136);
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await banking.createDepositInBD(user.id, 'USD', FIRST_DEPOSIT_AMOUNT - 1, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    await changeCurrency('USD');
    const bet = await makeSuccessfulOrdinaryBet(user, 'USD', BET_AMOUNT, coeff);
    await checkBonus(user.id, bet, FIRST_DEPOSIT_AMOUNT,
      0, BET_AMOUNT * coeff);
  });

  it('C1789804 (+) transfer & first deposit = RUB, bet = RUB', async () => {
    const coeff = 4.9;
    const TRANSFER_AMOUNT = 150;
    const FIRST_DEPOSIT_AMOUNT = 5000;
    const BET_AMOUNT = 100;

    const { data: user } = await register.oneClickReg();
    await banking.createTransferInBD(user.id, 'RUB', TRANSFER_AMOUNT, new Date(), 1, 136);
    // console.log(user);
    await banking.createDepositInBD(user.id, 'RUB', FIRST_DEPOSIT_AMOUNT, new Date(), 'card_rub', '4276550046464601', 1, 'payterra');
    await banking.createDepositInBD(user.id, 'USD', FIRST_DEPOSIT_AMOUNT - 1, new Date(), 'card', '4276550046464601', 1, 'payterra');
    await setUserBonusAmount(user.id, FIRST_DEPOSIT_AMOUNT);

    const bet = await makeSuccessfulOrdinaryBet(user, 'RUB', BET_AMOUNT, coeff);
    await checkBonus(user.id, bet, FIRST_DEPOSIT_AMOUNT - BET_AMOUNT * 0.05,
      BET_AMOUNT * 0.05, BET_AMOUNT * coeff);
  });
});
