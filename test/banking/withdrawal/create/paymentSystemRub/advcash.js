import { userList } from '../../../../../src/methods/userList';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const currency = 'RUB';
const payment_system = 'advcash_rub';


describe('Withdrawal create with valid test cases ', () => {
  beforeEach(async () => {
    await userList.loginWithRealMoney(socket);
  });

  it('C19337 - (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(99.99, 'lina.solodova@gmail.com',
      payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });

  it(' (-) With money  invalid', async () => {
    const { data } = await banking.withdrawalCreate(10, 'lina.solodova@gmail.com', payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });

  it(' (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(100, 'lina.solodova@gmail.com',
      payment_system, currency);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it(' (-) With money valid', async () => {
    const { data } = await banking.withdrawalCreate(9, 'lina.solodova@gmail.com', payment_system, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
