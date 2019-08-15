import { expect } from 'chai';
import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'qiwi_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for qiwi_rub - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22620 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreateRub(
      100, '+79001234567', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '79001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22623 min amount & wallet = (+91)', async () => {
    await banking.depositCreateRub(10,
      '+919001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '919001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22624 - > min amount & wallet = (+994)', async () => {
    await banking.depositCreateRub(11,
      '+9949001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '9949001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22625 - max amount & wallet = (+82)', async () => {
    await banking.depositCreateRub(15000,
      '+829001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15000, '829001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22626 - < max amount & wallet = (+372)', async () => {
    await banking.depositCreateRub(14999, '+3729001234567',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '3729001234567',
      'qiwi_rub', 'RUB');
  });


  it('C22628 - amount & wallet = (+374)', async () => {
    await banking.depositCreateRub(15, '+3749001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits 
WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '3749001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22710 - amount & wallet = (+44)', async () => {
    await banking.depositCreateRub(15, '+449001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '449001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22711 - amount & wallet = (+998)', async () => {
    await banking.depositCreateRub(15, '+9989001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '9989001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22712 - amount & wallet = (+972)', async () => {
    await banking.depositCreateRub(15, '+9729001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '9729001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22713 - amount & wallet = (+66)', async () => {
    await banking.depositCreateRub(15, '+669001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '669001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22714 - amount & wallet = (+90)', async () => {
    await banking.depositCreateRub(15, '+909001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '909001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22715 - amount & wallet = (+81)', async () => {
    await banking.depositCreateRub(15, '+8149001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '8149001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22716 - amount & wallet = (+1)', async () => {
    await banking.depositCreateRub(15, '+19001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '19001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22717 - amount & wallet = (+507)', async () => {
    await banking.depositCreateRub(15, '+5079001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '5079001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22718 - amount & wallet = (+77)', async () => {
    await banking.depositCreateRub(15, '+779001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '779001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22719 - amount & wallet = (+380)', async () => {
    await banking.depositCreateRub(15,
      '+3809001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '3809001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22720 - amount & wallet = (+371)', async () => {
    await banking.depositCreateRub(15,
      '+3719001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '3719001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22721 - amount & wallet = (+370)', async () => {
    await banking.depositCreateRub(15,
      '+3709001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '3709001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22722 - amount & wallet = (+996)', async () => {
    await banking.depositCreateRub(15,
      '+9969001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '9969001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22723 - amount & wallet = (+9955)', async () => {
    await banking.depositCreateRub(15,
      '+99559001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '99559001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22724 - amount & wallet = (+992)', async () => {
    await banking.depositCreateRub(15,
      '+9929001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '9929001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22725 - amount & wallet = (+373)', async () => {
    await banking.depositCreateRub(15,
      '+3739001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '3739001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22726 - amount & wallet = (+84)', async () => {
    await banking.depositCreateRub(15,
      '+849001234567', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15, '849001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22727 - < max amount & wallet = valid short number', async () => {
    await banking.depositCreateRub(14999, '+79001234',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '79001234',
      'qiwi_rub', 'RUB');
  });
});

describe('Create deposite for qiwi_rub invalid - RUB', () => {
  beforeAll(async () => {
    user = await register.oneClickReg();
  });

  it('C22635 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22636 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22637 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22638 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000.000001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });


  it('C22622  wallet = (8)phone', async () => {
    const data = await banking.depositCreateRub(
      2000, '89001234567', paymentType, currency,
    );
    // console.log(data);
    expect(data.data.status).equal(400);
    expect(data.data.message).equal('Неверный формат кошелька');
  });
});
