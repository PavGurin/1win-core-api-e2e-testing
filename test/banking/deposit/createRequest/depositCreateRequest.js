import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../src/expects/exDatabaseTests';

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
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '3333444455556666',
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

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '3333444455556666',
        'card', 'USD');
    });
  });
});
