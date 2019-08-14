import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'btc_usd';
const currency = 'RUB';
let user = {};

describe('Create deposit for btc_usd - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C28655 - (+) amount = 1751 & wallet = empty', async () => {
    await banking.depositCreateRub(
      1751, '', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1751, '',
      'btc_usd', 'RUB');
  });

  it('C28656 - min amount & wallet = symbols', async () => {
    await banking.depositCreateRub(1750,
      '+79215598289', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1750, '+79215598289',
      'btc_usd', 'RUB');
  });

  it('C28660 - max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(210000,
      '+79215598226', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 210000, '+79215598226',
      'btc_usd', 'RUB');
  });

  it('C28661 - < max amount & wallet = numbers', async () => {
    await banking.depositCreateRub(200999, '+79215598236',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 200999, '+79215598236',
      'btc_usd', 'RUB');
  });
});

describe('Create deposite for btc_usd invalid - RUB', () => {
  it('C28659 - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79215598256',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28662 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(1749.6, '79215598386',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28663 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(1749, '79215598486',
      paymentType, currency);
      // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28664 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(210001, '79215598586',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28657 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(210000.000001, '79215598686',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
