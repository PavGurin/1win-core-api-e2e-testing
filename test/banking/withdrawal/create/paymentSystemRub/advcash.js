import { userList } from '../../../../../src/methods/userList';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const payment_system = 'advcash_rub';


describe('Withdrawal create with valid test cases ', () => {
  before(async () => {
    await userList.loginWithRealMoney();
  });

  it('C19325 (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(99.99, 'lina.solodova@gmail.com',
      payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });

  it('C19324 (-) With money  invalid', async () => {
    const { data } = await banking.withdrawalCreate(10, 'lina.solodova@gmail.com', payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });
});

before(async () => {
  await userList.loginWithRealMoney();
});

it('C19325 (+) With money card_rub + valid wallet', async () => {
  const { data } = await banking.withdrawalCreate(100, 'lina.solodova@gmail.com',
    payment_system, currency);
  // console.log(data);
  successWithdrawalCreate(data);
});

it('C19324 (-) With money valid', async () => {
  const { data } = await banking.withdrawalCreate(9, 'lina.solodova@gmail.com', payment_system, currency);
  // console.log(data);
  successWithdrawalCreate(data);
});
