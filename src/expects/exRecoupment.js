import { banking } from '../methods/banking';
import { checkErrMsg } from '../responseChecker';

export async function checkRecoupment(withdrawalAmount, expectedResult) {
  const { data: withdrawalCheck } = await banking.checkWithdrawalPossible(withdrawalAmount);
  // console.log(withdrawalCheck);
  const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', withdrawalAmount);
  // console.log(withdrawalCreate);
  if (expectedResult === false) {
    expect(withdrawalCheck.result).toEqual(false);
    expect(withdrawalCreate.withdrawalBlocked).toEqual(true);
  } else if (expectedResult === true) {
    expect(withdrawalCheck.result).toEqual(true);
    expect(withdrawalCreate.confirmationRequested).toBeDefined();
  } else if (expectedResult === '403') {
    expect(withdrawalCheck.result).toEqual(true);
    checkErrMsg(withdrawalCreate, 403, 'Недостаточно средств');
  }
}
