import { cases } from '../../../src/methods/cases';
import { banking } from '../../../src/methods/banking';
import { addBetToBD } from '../../../src/methods/betsInBD';
import { register } from '../../../src/methods/register';

// скип, по очередной версии требований ограничения на коэффициент нет
describe.skip('Users with bet with coeff < 1.1', () => {
  // формула расчета возможности вывода:
  // сonst amountShouldBeSpent = balance < deposits - lostMoney ? balance : deposits;
  // lostMoney >= amountShouldBeSpent - тогда можо выводить

  const LOSE = 1;
  const WIN = 2;

  it('C1362817 - (+), lostMoney = 0 (bet on coeff < 1.1 - lose)', async () => {
    const depositAmount = 200;
    const betAmount = 100;
    const coeff = 1.09;
    const { data: user } = await register.usualRegMailru();
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date(), 'card_rub', '2323565689897474', 1);
    await addBetToBD(user.id, 'RUB', betAmount, coeff, LOSE);
    await banking.setBalance(user.id, depositAmount - betAmount);
    const { data } = await cases.playCaseWithoutChance(4);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      depositAmount - betAmount,
    );
    expect(withdrawalCheck.result).toEqual(true);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', depositAmount - betAmount);
    expect(withdrawalCreate.confirmationRequested).toEqual(false);
  });

  it('C1147472 - (-), lostMoney = 0 (bet on coeff < 1.1 - win)', async () => {
    const depositAmount = 200;
    const betAmount = 100;
    const coeff = 1.09;
    const { data: user } = await register.usualRegMailru();
    await banking.createDepositInBD(user.id, 'RUB', depositAmount, new Date(), 'card_rub', '2323565689897474', 1);
    await addBetToBD(user.id, 'RUB', betAmount, coeff, WIN);
    await banking.setBalance(user.id, depositAmount - betAmount + betAmount * coeff);
    const { data } = await cases.playCaseWithoutChance(4);
    // console.log(data);

    const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(
      betAmount * coeff,
    );
      // console.log(withdrawalCheck);
    expect(withdrawalCheck.result).toEqual(false);

    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', betAmount * coeff);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(true);
  });
});
