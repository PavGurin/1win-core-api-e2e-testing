import { expect } from 'chai';
import { register } from '../../../../src/methods/register';
import { getNewSocket } from '../../../global';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());

  // TODO больше проверок на PaymentType
  it.skip('C19376 (-) create without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create-request', {
      amount: 101,
      wallet: ' ',
      paymentType,
      currency,
    });
    // console.log(data);
    expect(data.redirectUrl).not.equal(null);
    expect(data.message).equal(undefined);
  });
});
