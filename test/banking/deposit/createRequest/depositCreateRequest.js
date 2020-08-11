import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { successDbDeposit } from '../../../../src/expects/exBanking';

let user = {};

describe('Deposit requests', () => {
  describe('Deposit requests in RUB', () => {
    const paymentType = 'card_rub';
    const currency = 'RUB';

    beforeEach(async () => {
      user = await register.oneClickReg();
    });

    it('C19376 - (+) valid request', async () => {
      await banking.depositCreateRequest('3333444455556666', paymentType, currency, 101);
      await successDbDeposit(user.data.id, 101, '3333444455556666',
        'card_rub', 'RUB');
    });
  });


  describe('Deposit requests in USD', () => {
    const currency = 'USD';
    beforeEach(async () => {
      user = await register.oneClickReg();
      // console.log(user);
    });

    it('C668350 - (+) valid request, \'card\'', async () => {
      await banking.depositCreateRequest('3333444455556666', 'card', currency, 101);
      await successDbDeposit(user.data.id, 101, '3333444455556666',
        'card', 'USD');
    });
  });
});
