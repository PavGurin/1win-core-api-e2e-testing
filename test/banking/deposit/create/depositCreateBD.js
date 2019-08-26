import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { successDbDeposit } from '../../../../src/expects/exDatabaseTests';

describe.skip('Deposit creation in database, USD', async () => {
  it('C27495 (+) successful deposit create usd + card', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '1234123412341234', 'card_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '1234123412341234', 'card_rub', 'USD');
  });

  it('C27496 (+) successful deposit create usd + beeline', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '+79211001122', 'beeline_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9211001122', 'beeline_rub', 'USD');
  });

  it('C27497 (+) successful deposit create usd + megafon', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '+79272223344', 'megafon_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9272223344', 'megafon_rub', 'USD');
  });

  it('C27498 (+) successful deposit create usd + mts', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '79119998877', 'mts_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9119998877', 'mts_rub', 'USD');
  });

  it('C27499 (+) successful deposit create usd + piastrix', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, 'qeqqweqwqewqda', 'piastrix_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, 'qeqqweqwqewqda', 'piastrix_rub', 'USD');
  });

  it('C27500 (+) successful deposit create usd + qiwi', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '+3739001234567', 'qiwi_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '3739001234567', 'qiwi_rub', 'USD');
  });

  it('C27501 (+) successful deposit create usd + tele2', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '+79526667788', 'tele2_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9526667788', 'tele2_rub', 'USD');
  });

  it('C27502 (+) successful deposit create usd + yamoney', async () => {
    const user = await register.oneClickRegUSD();
    await banking.depositCreateRub(100.01, '235235235243', 'yamoney_rub', 'USD');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '235235235243', 'yamoney_rub', 'USD');
  });
});

describe.skip('Deposit creation in database, EUR', async () => {
  it('C27503 (+) successful deposit create eur + card', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '1234123412341234', 'card_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '1234123412341234', 'card_rub', 'EUR');
  });

  it('C27504 (+) successful deposit create eur + beeline', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '+79211001122', 'beeline_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9211001122', 'beeline_rub', 'EUR');
  });

  it('C27505 (+) successful deposit create eur + megafon', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '+79272223344', 'megafon_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9272223344', 'megafon_rub', 'EUR');
  });

  it('C27506 (+) successful deposit create eur + mts', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '79119998877', 'mts_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9119998877', 'mts_rub', 'EUR');
  });

  it('C27507 (+) successful deposit create eur + piastrix', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, 'qeqqweqwqewqda', 'piastrix_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, 'qeqqweqwqewqda', 'piastrix_rub', 'EUR');
  });

  it('C27508 (+) successful deposit create eur + qiwi', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '+3739001234567', 'qiwi_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '3739001234567', 'qiwi_rub', 'EUR');
  });

  it('C27509 (+) successful deposit create eur + tele2', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '+79526667788', 'tele2_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '9526667788', 'tele2_rub', 'EUR');
  });

  it('C27510 (+) successful deposit create eur + yamoney', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreateRub(100.01, '235235235243', 'yamoney_rub', 'EUR');
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '235235235243', 'yamoney_rub', 'EUR');
  });
});
