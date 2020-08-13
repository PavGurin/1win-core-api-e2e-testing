import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import {
  pwaVisit, changeCurrency, setUserBonusAmount, getPWA,
} from '../../src/methods/user';
import { checkPwaBonus } from '../../src/expects/exUser';

async function getCurrencyConfig() {
  const config = {};
  const res = await mysqlConnection.executeQuery('select currency, amount from 1win.converter_config where type = \'PWA_BONUS\'');
  // console.log(res);
  res.forEach((row) => {
    config[`${row.currency}`] = row.amount;
  });
  // console.log(config);
  return config;
}

describe('Tests for pwa install bonus', () => {
  // there has to be a deposit, or else bonus will not be gained

  let config;
  const amount = 200;

  beforeAll(async () => {
    config = await getCurrencyConfig();
  });
  it('C2202878 (+) deposit in rub', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'qiwi_rub', '79111232233');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.RUB);
  });
  it('C2202879 (+) deposit in usd', async () => {
    const { data: user } = await register.oneClickRegUSD();
    await banking.createDepositInBD(user.id, 'USD', amount, new Date(), 'qiwi_usd', '79111232233');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.USD);
  });
  it('C2202880 (+) deposit in eur', async () => {
    const { data: user } = await register.oneClickRegEUR();
    await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'qiwi_eur', '79111232233');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.EUR);
  });
  it('C2202881 (+) deposit in uah', async () => {
    const { data: user } = await register.oneClickRegUAH();
    await banking.createDepositInBD(user.id, 'UAH', amount, new Date(), 'card', '4276550046589721');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.UAH);
  });
  it('C2202882 (-) bonus is not gained for second pwa visit', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'qiwi_rub', '79111232233');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.RUB);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.RUB);
  });
  it('C2202883 (-) bonus is not gained if there were no deposit', async () => {
    const { data: user } = await register.oneClickRegUSD();
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, undefined);
  });
  it('C2202884 (+) bonus is gained if there is a deposit, but no bonus_amount in user meta', async () => {
    const { data: user } = await register.oneClickRegEUR();
    await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'qiwi_eur', '79111232233');
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, config.EUR);
  });
  it('C2202885 (+) bonus amount is chosen depending on first deposit currency', async () => {
    const { data: user } = await register.oneClickRegUAH();
    await banking.createDepositInBD(user.id, 'UAH', amount, new Date(), 'card', '4276550046589721');
    await banking.createDepositInBD(user.id, 'EUR', amount, new Date(), 'qiwi_eur', '79111232233');
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'qiwi_rub', '79111232233');
    await changeCurrency('RUB');
    await setUserBonusAmount(user.id, amount);
    await pwaVisit(user.id);
    await checkPwaBonus(user.id, amount + config.UAH);
  });
  it('C2202886 (-) bonus is not gained if pwa was downloaded, but not visited', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.createDepositInBD(user.id, 'RUB', amount, new Date(), 'qiwi_rub', '79111232233');
    await getPWA('android');
    await checkPwaBonus(user.id, undefined, false);
  });
});
