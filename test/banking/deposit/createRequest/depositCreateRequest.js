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
      user = await register.oneClickReg(socket);
    });

    it('C19376 (+) valid request', async () => {
      await banking.depositCreateRequest(101, '3333444455556666',
        paymentType, currency);

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
      user = await register.oneClickReg(socket);
      console.log(user);
    });

    it(' (+) valid request, \'card_rub\'', async () => {
      await banking.depositCreateRequest(101, '3333444455556666',
        'card_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '3333444455556666',
        'card_rub', 'USD');
    });

    it(' (+) valid request, \'beeline_rub\'', async () => {
      await banking.depositCreateRequest(101, '+79001234567',
        'beeline_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '9001234567',
        'beeline_rub', 'USD');
    });

    it(' (+) valid request, \'btc_usd\'', async () => {
      await banking.depositCreateRequest(10100, '+79001234567',
        'btc_usd', currency);
      // console.log(ban);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 10100, '+79001234567',
        'btc_usd', 'USD');
    });
    it(' (+) valid request, \'eth_usd\'', async () => {
      await banking.depositCreateRequest(10100, '+79001234567',
        'eth_usd', currency);
      // console.log(ban);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 10100, '+79001234567',
        'eth_usd', 'USD');
    });

    it(' (+) valid request, \'megafon_rub\'', async () => {
      await banking.depositCreateRequest(101, '+79001234567',
        'megafon_rub', currency);
      // console.log(ban);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '9001234567',
        'megafon_rub', 'USD');
    });

    it(' (+) valid request, \'mts_rub\'', async () => {
      await banking.depositCreateRequest(101, '+79001234567',
        'mts_rub', currency);
      // console.log(ban);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '9001234567',
        'mts_rub', 'USD');
    });

    it(' (+) valid request, \'piastrix_rub\'', async () => {
      await banking.depositCreateRequest(101, '+79001234567',
        'piastrix_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '+79001234567',
        'piastrix_rub', 'USD');
    });

    it(' (+) valid request, \'qiwi_rub\'', async () => {
      await banking.depositCreateRequest(101, '+79001234567',
        'qiwi_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '79001234567',
        'qiwi_rub', 'USD');
    });

    it(' (+) valid request, \'tele2_rub\'', async () => {
      await banking.depositCreateRequest(101, '9001234567',
        'tele2_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '9001234567',
        'tele2_rub', 'USD');
    });

    it(' (+) valid request, \'yamoney_rub\'', async () => {
      await banking.depositCreateRequest(101, '9001234567',
        'yamoney_rub', currency);

      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
    WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 101, '9001234567',
        'yamoney_rub', 'USD');
    });
  });
});
