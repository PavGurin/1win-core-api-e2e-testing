import { expect } from 'chai';
import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'yamoney_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for yamoney_ru - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22646 (+) amount = 100 & wallet = empty', async () => {
    await banking.depositCreateRub(
      100, '', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '',
      'yamoney_rub', 'RUB');
  });

  it('C22649 - min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(10,
      '123234345456 etryrt', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '123234345456 etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22650 - > min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(11,
      '12№%:№%:45456etryrt', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '12№%:№%:45456etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22651 - max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(100000, '09090909999',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100000, '09090909999',
      'yamoney_rub', 'RUB');
  });

  it('C22652 - < max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(99999, '0[[[?<><?999',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 99999, '0[[[?<><?999',
      'yamoney_rub', 'RUB');
  });

  it('C22654 wallet = undefined', async () => {
    await banking.depositCreateRub(100, undefined,
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    expect(dbResult.length).to.equal(5);
  });
});

describe('Create deposite for yamoney_ru invalid - RUB', () => {
  it('C22661 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22662 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22663 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22664 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
