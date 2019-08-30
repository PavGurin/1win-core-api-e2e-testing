import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';
import { getNewSocket } from '../../../../global';

const paymentType = 'tele2_rub';
const currency = 'RUB';
const user = {};

describe('Create deposite for tele2 - RUB @master', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());

  it('C22672 - (+) amount = 100 & wallet = (+7)phone', async () => {
    await banking.depositCreate(
      100, '+79772520000', paymentType, currency,
    );
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22675 - min amount & wallet = symbols', async () => {
    await banking.depositCreate(10,
      '+79772520000', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22676 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate(11,
      '+79772520000', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22677 - max amount & wallet = numbers', async () => {
    await banking.depositCreate(15000, '+79772520000',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 15000, '9772520000',
      'tele2_rub', 'RUB');
  });

  it('C22678 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate(14999, '+79772520000',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 14999, '9772520000',
      'tele2_rub', 'RUB');
  });
});

describe('Create deposite for tele2_rub invalid - RUB', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());

  it('C22687 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate(0.6, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22688 - amount < min amount', async () => {
    const { data } = await banking.depositCreate(9, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22689 - amount > max amount', async () => {
    const { data } = await banking.depositCreate(15001, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22690 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate(15000.000001, '+79772520000',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
