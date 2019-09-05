import { expect } from 'chai';
import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';

const paymentType = 'card_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for card_rub - RUB', () => {

  beforeEach(async () => {
    socket = await getNewSocket();
    user = await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());


  it('C22535 - (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(
      100, '', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  // TODO возвращается 500 если передаем amount c 3мя знаками после запятой
  it(' - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      100.013, '123 autotests', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });
  it(' - (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      100.013, '123 autotests', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it('C22538 - min amount', async () => {
    await banking.depositCreate(100, '3333444455556666',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100, '3333444455556666',
      'card_rub', 'RUB');
  });

  it('C22539 - > min amount', async () => {
    await banking.depositCreate(101, '9090787856564545', paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 101, '9090787856564545',
      'card_rub', 'RUB');
  });

  it('C22540 - max amount', async () => {
    await banking.depositCreate(100000, '0909090999990909',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100000, '0909090999990909',
      'card_rub', 'RUB');
  });

  it('C22541 - < max amount', async () => {
    await banking.depositCreate(99999, '5566556644553344',
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 99999, '5566556644553344',
      'card_rub', 'RUB');
  });

  it('C22543 wallet = undefined', async () => {
    await banking.depositCreate(100, undefined,
      paymentType, currency);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
    // console.log(dbResult);
    expect(dbResult.length).to.equal(4);
  });
});

describe('Create deposite for card_rub invalid - RUB', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());

  it('C22516 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate(90.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22517 - 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreate(99, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22518 - amount > max amount', async () => {
    const { data } = await banking.depositCreate(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22519 - amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreate(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22535 (-) wallet = empty', async () => {
    const { data } = await banking.depositCreate(
      100, '', paymentType, currency,
    );
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
