import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { banking } from '../../src/methods/banking';
import { successDepositCreate } from '../../src/expects/exBanking';
import { register } from '../../src/methods/register';


describe.skip('Manual control wallets(?)', () => {
  const paymentType = 'beeline_rub';
  const currency = 'RUB';
  const payment_system = 'beeline_rub';
  before('', async () => {
    await register.oneClickReg();
  });

  it('deposit @master', async () => {
    await socket.userMeta;
    // console.log(data1);
    const { data } = await banking.depositCreateRub(100, '79772520000',
      paymentType, currency);
    successDepositCreate(data, currency, paymentType, 100);
    const data2 = await socket.userMeta;
    console.log(data2);
    expect(data2.withdrawal_manual_control).equal(true);
  });

  it('withdrawal', async () => {
    const { data } = await banking.withdrawalCreate(100, '79772520000', payment_system, currency);
    console.log(data);
    // expect(data.status).equal(200);
    const data2 = await socket.userMeta;
    console.log(data2);
    expect(data2.withdrawal_manual_control).equal(true);
  });
});

describe.skip('Blocked wallets deposit', () => {
  before('', async () => {
    const ddd = await userList.loginPartialBlock();
    console.log(ddd);
  });

  it('deposit', async () => {
    const data1 = await socket.userMeta;
    console.log(data1);
  });
  it('transfet', async () => {
    expect(data.status).equal(200);
    expect(data.withdrawalBlocked).equal(true);
  });


  it('withdrawal', async () => {
    expect(data.status).equal(200);
    expect(data.withdrawalBlocked).equal(true);
  });
});
