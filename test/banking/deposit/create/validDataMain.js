import { banking } from '../../../../src/methods/banking';
import { register } from '../../../../src/methods/register';
import { successDbDeposit } from '../../../../src/expects/exBanking';

describe('Create deposit for beeline_rub - RUB', () => {
  const paymentType = 'beeline_rub';
  const currency = 'RUB';
  let user = {};

  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22492 - without currency', async () => {
    await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79215598246',
      paymentType,
    });
    await successDbDeposit(user.data.id, 100, '9215598246',
      'beeline_rub', 'RUB');
  });

  it('C22499 - amount = string-number', async () => {
    await banking.depositCreate('79215598186', paymentType, currency, '100');
    await successDbDeposit(user.data.id, 100, '9215598186',
      'beeline_rub', 'RUB');
  });

  it('C22487 - amount = 2000 & wallet = (8)phone', async () => {
    await banking.depositCreate('89215598288', paymentType, currency, 2000);
    await successDbDeposit(user.data.id, 2000, '9215598288',
      'beeline_rub', 'RUB');
  });

  it('C22486 - (+) amount = 100.01 & wallet = (7)phone', async () => {
    await banking.depositCreate('79215598287', paymentType, currency, 100.01);
    await successDbDeposit(user.data.id, 100.01, '9215598287',
      'beeline_rub', 'RUB');
  });

  it('C28680 - (+) amount = 100.156 & wallet = (7)phone', async () => {
    await banking.depositCreate('79215598287', paymentType, currency, 100.156);
    await successDbDeposit(user.data.id, 100.16, '9215598287',
      'beeline_rub', 'RUB');
  });
});
