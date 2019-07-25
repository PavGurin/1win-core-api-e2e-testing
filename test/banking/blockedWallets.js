import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { successDepositCreate } from '../../src/expects/exBanking';

describe.skip('Manual control wallets(?)', () => {
  const paymentType = 'beeline_rub';
  const currency = 'RUB';
  const payment_system = 'beeline_rub';
  beforeAll('', async () => {
    await userList.loginManualControl();
  });

  it.skip('deposit @master', async () => {
    await socket.userMeta;
    // console.log(data1);
    const { data } = await banking.depositCreateRub(100, '79772520000',
      paymentType, currency);
    successDepositCreate(data, currency, paymentType, 100);
    const data2 = await socket.userMeta;
    // console.log(data2);
    expect(data2.withdrawal_manual_control).equal(true);
  });

  it('withdrawal', async () => {
    await banking.withdrawalCreate(100, '+79772520000', payment_system, currency);
    // console.log(data);
    const data2 = await socket.userMeta;
    // console.log(data2);
    expect(data2.withdrawal_manual_control).equal(true);
  });
});

describe.skip('Blocked wallets deposit', () => {
  beforeAll('', async () => {
    await userList.loginPartialBlock();
    // console.log(ddd);
  });

  it('deposit', async () => {
    await socket.userMeta;
    // console.log(data1);
  });
  it('transfet', async () => {
  });


  it('withdrawal', async () => {
  });
});
