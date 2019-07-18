import { expect } from 'chai';
import { register } from '../../../src/methods/register';
import { randomStr } from '../../../src/randomizer';
import { mysqlConnection } from '../../../src/methods/mysqlConnection';
import { banking } from '../../../src/methods/banking';

// returns withdrawals sorted by time
describe('Withdrawal history', () => {
  it('C19359 - (+) without withdrawal', async () => {
    await register.oneClickReg();
    const { data } = await socket.send('BANKING:withdrawal-history');
    // console.log(data);
    expect(data.length).equal(0);
  });

  it('C19360 -(+) with withdrawal @dev', async () => {
    const user = await register.usualReg({
      email: `${randomStr(5)}_test@mail.ru`,
    });
    await mysqlConnection.executeQuery(`UPDATE 1win.ma_balance SET amount = 200 WHERE id_user = ${user.data.id} ;`);
    await banking.withdrawalCreate(100, '1111222233334444', 'card_rub', 'RUB');
    const { data } = await socket.send('BANKING:withdrawal-history');
    // console.log(data);
    expect(data[0].payment_system).equal('card_rub');
    expect(data[0].amount).equal(100);
    expect(data[0].status).equal(0);
  });
});
