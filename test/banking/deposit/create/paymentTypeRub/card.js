import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';
import { getNewSocket } from '../../../../global';

const paymentType = 'card_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for card_rub - RUB', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    user = await register.oneClickReg(socket);
  });

  it('C22538 - min amount', async () => {
    await banking.depositCreate(socket, '3333444455556666', paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '3333444455556666',
      'card_rub', 'RUB');
  });

  it('C22539 - > min amount', async () => {
    await banking.depositCreate(socket, '9090787856564545', paymentType, currency, 101);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 101, '9090787856564545',
      'card_rub', 'RUB');
  });

  it('C22540 - max amount', async () => {
    await banking.depositCreate(socket, '0909090999990909', paymentType, currency, 100000);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100000, '0909090999990909',
      'card_rub', 'RUB');
  });

  it('C22541 - < max amount', async () => {
    await banking.depositCreate(socket, '5566556644553344', paymentType, currency, 99999);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 99999, '5566556644553344',
      'card_rub', 'RUB');
  });

  it('C22543 wallet = undefined', async () => {
    await banking.depositCreate(socket, undefined, paymentType, currency, 100);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for card_rub invalid - RUB', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it('C22516 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 90.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22517 - 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 99);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22518 - amount > max amount', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22519 - amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100000.56);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22535 (-) wallet = empty', async () => {
    const { data } = await banking.depositCreate(socket, '', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
