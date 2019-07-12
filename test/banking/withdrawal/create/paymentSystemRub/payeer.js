import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const payment_system = 'payeer_rub';


describe('Withdrawal create with valid test cases ', () => {
  before(async () => {
    await userList.loginWithRealMoney();
  });

  it('C19336 - (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(90, 'P0000000000',
      payment_system, currency);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(100, '5446546', payment_system, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
