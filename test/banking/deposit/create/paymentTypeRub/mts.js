import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'mts_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for mts_rub - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22568 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreateRub(
      100, '+79001234567', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22571 - min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(10,
      '+79001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22572 - > min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(11,
      '+79001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '9001234567',
      'mts_rub', 'RUB');
  });

  it('C22573 - max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(14999,
      '+79001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '9001234567',
      'mts_rub', 'RUB');
  });
});

describe('Create deposite for mts_rub invalid - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22583 amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22584 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22585 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22586 - amount double> max amount', async () => {
    const { data } = await banking.depositCreateRub(14999.000001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
