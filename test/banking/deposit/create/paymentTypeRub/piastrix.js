import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';
import { getNewSocket } from '../../../../global';

const paymentType = 'piastrix_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for piastrix_rub - RUB ', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    user = await register.oneClickReg(socket);
  });

  it('C22594 - (+) amount = 100 & wallet = empty', async () => {
    await banking.depositCreate(socket, '', paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '',
      'piastrix_rub', 'RUB');
  });

  it('C22597 - min amount & wallet = symbols', async () => {
    await banking.depositCreate(socket, '123234345456 etryrt', paymentType, currency, 1);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 1, '123234345456 etryrt',
      'piastrix_rub', 'RUB');
  });

  it('C22598 - > min amount & wallet = symbols', async () => {
    await banking.depositCreate(socket, '12№%:№%:45456etryrt', paymentType, currency, 2);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 2, '12№%:№%:45456etryrt',
      'piastrix_rub', 'RUB');
  });

  it('C22600 - < max amount & wallet = numbers', async () => {
    await banking.depositCreate(socket, '0[[[?<><?999', paymentType, currency, 99999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 99999, '0[[[?<><?999',
      'piastrix_rub', 'RUB');
  });
});

describe('Create deposite for piastrix_rub invalid - RUB', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it('C22609 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22611 - amount > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22612 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
