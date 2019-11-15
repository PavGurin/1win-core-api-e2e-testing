import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'tele2_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for tele2 - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22672 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22675 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 10);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22676 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 11);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22677 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 15000);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15000, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22678 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79772520000', paymentType, currency, 14999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '9772520000',
      'tele2_rub', 'RUB');
  });
});

describe('Create deposite for tele2_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22687 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22688 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22689 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 15001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22690 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('+79772520000', paymentType, currency, 15000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
