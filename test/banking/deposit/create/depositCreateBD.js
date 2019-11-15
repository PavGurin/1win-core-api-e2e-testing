import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { successDbDeposit } from '../../../../src/expects/exDatabaseTests';
import { checkErrMsg } from '../../../../src/responseChecker';

describe('Deposit creation in database, USD', () => {
  it('C27495 (+) successful deposit create usd + card', async () => {
    const user = await register.oneClickRegUSD();
    // console.log(user);

    await banking.depositCreate('1234123412341234', 'card', 'USD', 100.01);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '1234123412341234', 'card', 'USD');
  });

  it('C27496 - Неверный способ оплаты', async () => {
    await register.oneClickRegUSD();
    const { data } = await banking.depositCreate('+79211001122', 'beeline_rub', 'USD', 100.01);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});

describe('Deposit creation in database, EUR', () => {
  it('C27503 (+) successful deposit create eur + card', async () => {
    const user = await register.oneClickRegEUR();
    await banking.depositCreate('1234123412341234', 'card', 'EUR', 100.01);
    const dbResult = await mysqlConnection.executeQuery(`SELECT * FROM 1win.ma_deposits WHERE id_user = ${user.data.id} ;`);
    // console.log(dbResult);
    successDbDeposit(dbResult, 100.01, '1234123412341234', 'card', 'EUR');
  });
});
