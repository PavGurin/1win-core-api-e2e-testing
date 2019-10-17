import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { register } from '../../../../../src/methods/register';
import { mysqlConnection } from '../../../../../src/methods/mysqlConnection';
import { successDbDeposit } from '../../../../../src/expects/exDatabaseTests';
import { getNewSocket } from '../../../../global';


describe('Create deposite for beeline_rub', () => {
  const paymentType = 'beeline_rub';
  const currency = 'RUB';
  let user = {};

  describe('Create deposite for beeline_rub - RUB', () => {
    let socket;
    beforeEach(async () => {
      socket = await getNewSocket();
      user = await register.oneClickReg(socket);
    });

    it('C22485 - (+) amount = 100 & wallet = (+7)phone', async () => {
      await banking.depositCreate(socket, '+79001234567', paymentType, currency, 100);
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 100, '9001234567',
        'beeline_rub', 'RUB');
    });

    it('C22488 - min amount & wallet = symbols', async () => {
      await banking.depositCreate(socket, '+79215598289', paymentType, currency, 10);
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC ;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 10, '9215598289',
        'beeline_rub', 'RUB');
    });

    it('C22489 - > min amount & wallet = symbols', async () => {
      await banking.depositCreate(socket, '+79215598216', paymentType, currency, 11);
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 11, '9215598216',
        'beeline_rub', 'RUB');
    });

    it('C22490 - max amount & wallet = numbers', async () => {
      await banking.depositCreate(socket, '+79215598226', paymentType, currency, 15000);
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id} ORDER BY id DESC ;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 15000, '9215598226',
        'beeline_rub', 'RUB');
    });

    it('C22491 - < max amount & wallet = numbers', async () => {
      await banking.depositCreate(socket, '+79215598236', paymentType, currency, 14999);
      const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits
 WHERE id_user = ${user.data.id}  ORDER BY id DESC ;`);
      // console.log(dbResult);
      successDbDeposit(dbResult, 14999, '9215598236',
        'beeline_rub', 'RUB');
    });
  });

  describe('Create deposite for beeline_rub invalid - RUB', () => {
    let socket;
    beforeAll(async () => {
      socket = await getNewSocket();
      await register.oneClickReg(socket);
    });
    it('C22500 - amount double < min amount', async () => {
      const { data } = await banking.depositCreate(socket, '79215598386', paymentType, currency, 0.6);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22501 - amount < min amount', async () => {
      const { data } = await banking.depositCreate(socket, '79215598486', paymentType, currency, 9);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22502 - amount > max amount', async () => {
      const { data } = await banking.depositCreate(socket, '79215598586', paymentType, currency, 15001);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверная сумма');
    });

    it('C22503 - amount double > max amount', async () => {
      const { data } = await banking.depositCreate(socket, '79215598686', paymentType, currency, 15000.000001);
      // console.log(data);
      checkErrMsg(data, 400, 'Неверная сумма');
    });
  });
});
