import { expect } from 'chai';
import { register } from '../../../../src/methods/register';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  before(async () => {
    await register.oneClickReg();
  });

  // TODO больше проверок на PaymentType
  it('C19376 (-) create without currency @master', async () => {
    const { data } = await socket.send('BANKING:deposit-create-request', {
      amount: 100,
      wallet: '',
      paymentType,
    });
    // console.log(data);
    expect(data.redirectUrl).not.equal(null);
    expect(data.message).equal(undefined);
  });

  it(' (+) create with currency @master', async () => {
    const { data } = await socket.send('BANKING:deposit-create-request', {
      amount: 100,
      wallet: '',
      paymentType,
      currency,
    });
    // console.log(data);
    expect(data.redirectUrl).not.equal(null);
    expect(data.message).equal(undefined);
  });
});
