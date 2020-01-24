import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'btc_usd';
const currency = 'RUB';
let user = {};

describe('Creating deposit for btc_usd - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C28655 - (+) amount = 1751 & wallet = empty', async () => {
    await banking.depositCreate('', paymentType, currency, 1751);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1751, '',
      'btc_usd', 'RUB');
  });

  it('C28656 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79215598289', paymentType, currency, 1750);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1750, '+79215598289',
      'btc_usd', 'RUB');
  });

  it('C28660 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598226', paymentType, currency, 210000);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 210000, '+79215598226',
      'btc_usd', 'RUB');
  });

  it('C28661 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598236', paymentType, currency, 200999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 200999, '+79215598236',
      'btc_usd', 'RUB');
  });
});

describe('Create deposite for btc_usd invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C28659 - amount = 0', async () => {
    const { data } = await banking.depositCreate('+79215598256', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28662 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('79215598386', paymentType, currency, 1749.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28663 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('79215598486', paymentType, currency, 1749);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28664 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('79215598586', paymentType, currency, 210001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28657 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('79215598686', paymentType, currency, 210000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
