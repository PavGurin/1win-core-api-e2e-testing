import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';

describe('User with withdrawal from partner', () => {
  it('C1987947 (+) withdrawal is possible', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createPartnerWithdrawalInBD(user.id);
    await banking.setBalance(user.id, 1000);
    const { data: withdrawalCreate } = await banking.withdrawalCreate('79116665544', 'mts_rub', 'RUB', 1000);
    // console.log(withdrawalCreate);
    expect(withdrawalCreate.confirmationRequested).toEqual(true);
  });
});
