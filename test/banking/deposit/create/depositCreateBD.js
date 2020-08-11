import { mysqlConnection } from '../../../../src/methods/mysqlConnection';
import { register } from '../../../../src/methods/register';
import { banking } from '../../../../src/methods/banking';
import { successDbDeposit } from '../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../src/responseChecker';

describe('Deposit creation in database, USD', () => {
  it('C27495 (+) successful deposit create usd + card', async () => {
    const { data: user } = await register.oneClickRegUSD();
    // console.log(user);

    await banking.depositCreate('1234123412341234', 'card', 'USD', 100.01);
    await successDbDeposit(user.id, 100.01, '1234123412341234', 'card', 'USD');
  });

  it('C27496 - Неверный способ оплаты', async () => {
    await register.oneClickRegUSD();
    const { data } = await banking.depositCreate('+79211001122', 'beeline_rub', 'USD', 100.01);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});

describe('Deposit creation in database, EUR', () => {
  it('C27503 (+) successful deposit create eur + card', async () => {
    const { data: user } = await register.oneClickRegEUR();
    await banking.depositCreate('1234123412341234', 'card', 'EUR', 100.01);
    await successDbDeposit(user.id, 100.01, '1234123412341234', 'card', 'EUR');
  });
});
