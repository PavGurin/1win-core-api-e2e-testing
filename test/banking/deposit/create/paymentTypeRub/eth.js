import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'eth_usd';
const currency = 'RUB';
let user = {};

describe('Create deposit for eth_usd - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C28665 - (+) amount = 751 & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 1751);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1751, '+79001234567',
      'eth_usd', 'RUB');
  });

  it('C28666 - min amount & wallet = symbols', async () => {
    await banking.depositCreate('+79215598289', paymentType, currency, 1750);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1750, '+79215598289',
      'eth_usd', 'RUB');
  });

  it('C28667 - max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598226', paymentType, currency, 21000);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 21000, '+79215598226',
      'eth_usd', 'RUB');
  });

  it('C28668 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate('+79215598236', paymentType, currency, 20999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 20999, '+79215598236',
      'eth_usd', 'RUB');
  });
});

describe('Create deposite for eth_usd invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C28669 - amount = 0', async () => {
    const { data } = await banking.depositCreate('+79215598256', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });


  it('C28670 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('79215598386', paymentType, currency, 1749.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28671 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('79215598486', paymentType, currency, 1749);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28672 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('79215598586', paymentType, currency, 210001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C28673 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('79215598686', paymentType, currency, 210000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
