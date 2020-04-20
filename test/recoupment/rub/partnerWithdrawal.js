import { register } from '../../../src/methods/register';
import { banking } from '../../../src/methods/banking';
import { setUserRegisterDate } from '../../../src/methods/user';
import { checkRecoupment } from '../../../src/expects/exRecoupment';

describe('User with withdrawal from partner', () => {
  it('C2001948 (+) old user, one deposit from partner', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, '2019-09-19 00:00:01');
    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', 1000, 182, new Date('2020-04-16 13:00:00'));
    await banking.setBalance(user.id, 1000);
    await checkRecoupment('1000', true);
  });

  it('C2001949 (-) old user, partner + card', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, '2019-09-19 00:00:01');
    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', 1000, 182, new Date('2020-04-16 13:00:00'));
    await banking.createDepositInBD(user.id, 'RUB', 1000, new Date('2020-04-16 13:10:00'));
    await banking.setBalance(user.id, 2000);
    await checkRecoupment('10', false);
  });

  it('C2001950 (-) old user, card + partner', async () => {
    const { data: user } = await register.oneClickReg();
    await setUserRegisterDate(user.id, '2019-09-19 00:00:01');
    await banking.createDepositInBD(user.id, 'RUB', 1000, new Date('2020-04-16 13:00:00'));
    await banking.createPartnerWithdrawalInBD(user.id, 'RUB', 1000, 182, new Date('2020-04-16 13:10:00'));
    await banking.setBalance(user.id, 2000);
    await checkRecoupment('10', false);
  });


  it('C1987947 (+) new user, one deposit from partner', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createPartnerWithdrawalInBD(user.id);
    await banking.setBalance(user.id, 1000);
    await checkRecoupment('1000', true);
  });

  it('C2001946 (-) new user, partner + card', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createPartnerWithdrawalInBD(user.id);
    await banking.createDepositInBD(user.id);
    await banking.setBalance(user.id, 2000);
    await checkRecoupment('10', false);
  });

  it('C2001947 (-) new user, card + partner', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createDepositInBD(user.id);
    await banking.createPartnerWithdrawalInBD(user.id);
    await banking.setBalance(user.id, 2000);
    await checkRecoupment('10', false);
  });
});
