import { banking } from '../../../../src/methods/banking';
import { register } from '../../../../src/methods/register';
import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../src/expects/exDatabaseTests';

describe('Create deposit for beeline_rub - RUB', () => {
  const paymentType = 'beeline_rub';
  const currency = 'RUB';
  let user = {};

  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22492 - without currency', async () => {
    await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79215598246',
      paymentType,
    });
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '9215598246',
      'beeline_rub', 'RUB');
  });

  it('C22499 - amount = string-number', async () => {
    await banking.depositCreateRub('50', '79215598186',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 50, '9215598186',
      'beeline_rub', 'RUB');
  });

  it('C22487 - amount = 2000 & wallet = (8)phone', async () => {
    await banking.depositCreateRub(
      2000, '89215598288', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 2000, '9215598288',
      'beeline_rub', 'RUB');
  });

  it('C22486 - (+) amount = 100.01 & wallet = (7)phone', async () => {
    await banking.depositCreateRub(
      100.01, '79215598287', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9215598287',
      'beeline_rub', 'RUB');
  });

  it('C28680 - (+) amount = 100.156 & wallet = (7)phone', async () => {
    await banking.depositCreateRub(
      100.156, '79215598287', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.16, '9215598287',
      'beeline_rub', 'RUB');
  });
});
