import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { logOut } from '../../../src/methods/user';


describe('Withdrawal create with user with money USD ', () => {
  before(async () => {
    await logOut();
    await userList.loginWithRealMoney();
    // console.log(data1);
  });

  it('C19329 (+) With money beeline_rub + valid wallet + USD', async () => {
    const { data } = await socket.send('BANKING:withdrawal-create', {
      amount: '100',
      payment_system: 'beeline_rub',
      wallet: '+79215645656',
      currency: 'USD',
    });
    // console.log(data);
    expect(data).to.be.an('object');
    expect(data.email).not.equal(null);
    expect(data.message).equal(undefined);
  });
});
