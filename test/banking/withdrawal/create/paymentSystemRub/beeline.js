import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const payment_system = 'beeline_rub';


describe('Withdrawal create with valid test cases ', () => {
  before(async () => {
    await userList.loginWithRealMoney();
  });

  it(' (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(90.99, '+79215598286',
      payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });

  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(10, '+79215598286', payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });
  it('(-) With money invali', async () => {
    const { data } = await banking.withdrawalCreate(10.015, '+79215598286', payment_system, currency);
    // console.log
    successWithdrawalCreate(data);
  });

  describe('Withdrawal create with invalid test cases ', () => {
    before(async () => {
      await userList.loginWithRealMoney();
    });

    it('C19325 (+) With money card_rub + valid wallet', async () => {
      const { data } = await banking.withdrawalCreate(9, '+79215598286',
        payment_system, currency);
      // console.log(data);
      successWithdrawalCreate(data);
    });

    it('C19324 (-) With money invalid', async () => {
      const { data } = await banking.withdrawalCreate(10.01, '+79215598286', payment_system, currency);
      // console.log(data);
      checkErrMsg(data, 400, 'Bad Request.');
    });
  });
});
