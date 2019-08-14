import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'beeline_rub';
const currency = 'RUB';

let user = {};

describe('Create deposit for beeline_rub - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22485 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreateRub(
      100, '+79001234567', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '9001234567',
      'beeline_rub', 'RUB');
  });

  it('C22488 - min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(10,
      '+79215598289', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '9215598289',
      'beeline_rub', 'RUB');
  });

  it('C22489 - > min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(11,
      '+79215598216', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '9215598216',
      'beeline_rub', 'RUB');
  });

  it('C22490 - max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(15000,
      '+79215598226', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15000, '9215598226',
      'beeline_rub', 'RUB');
  });

  it('C22491 - < max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(14999, '+79215598236',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '9215598236',
      'beeline_rub', 'RUB');
  });
});

describe('Create deposite for beeline_rub invalid - RUB', () => {
  it('C22500 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '79215598386',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22501 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '79215598486',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22502 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15001, '79215598586',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22503 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000.000001, '79215598686',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
