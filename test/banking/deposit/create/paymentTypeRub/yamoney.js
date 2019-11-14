import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';
import { getNewSocket } from '../../../../global';

const paymentType = 'yamoney_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for yamoney_ru - RUB', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    user = await register.oneClickReg(socket);
  });

  it('C22646 (+) amount = 100 & wallet = empty', async () => {
    await banking.depositCreate(socket, '', paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '',
      'yamoney_rub', 'RUB');
  });

  it('C22649 - min amount & wallet = symbols', async () => {
    await banking.depositCreate(socket, '123234345456 etryrt', paymentType, currency, 10);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 10, '123234345456 etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22650 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate(socket, '12№%:№%:45456etryrt', paymentType, currency, 11);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 11, '12№%:№%:45456etryrt',
      'yamoney_rub', 'RUB');
  });

  it('C22651 - max amount & wallet = numbers', async () => {
    await banking.depositCreate(socket, '09090909999', paymentType, currency, 100000);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100000, '09090909999',
      'yamoney_rub', 'RUB');
  });

  it('C22652 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate(socket, '0[[[?<><?999', paymentType, currency, 99999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 99999, '0[[[?<><?999',
      'yamoney_rub', 'RUB');
  });

  it('C22654 wallet = undefined', async () => {
    await banking.depositCreate(socket, undefined, paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC;`);
    // console.log(dbResult);
    expect(dbResult.length).toEqual(1);
  });
});

describe('Create deposite for yamoney_ru invalid - RUB', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it('C22661 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22662 - amount < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22663 - amount > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22664 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
