import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const payment_system = 'beeline_rub';

describe('Withdrawal create with valid test cases ', () => {
  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });

  it(' (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate('+79215598286', payment_system, currency, 90);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it(' (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate('+79215598286', payment_system, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate('5446546', payment_system, currency, 1);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
