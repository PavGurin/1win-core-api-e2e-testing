import { register } from '../../../../../src/methods/register';
import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const payment_system = 'card_rub';


describe('Withdrawal create with valid test cases ', () => {
  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });
  it('C19325 (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate('5137437961176095', payment_system, currency, 100);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it('C19324 (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate('5446546', payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});

describe('Withdrawal create with invalid test cases ', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('(-) Without money, wallet = string', async () => {
    const { data } = await banking.withdrawalCreate(5446546, payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('C19278 - (-) Without money ', async () => {
    const { data } = await banking.withdrawalCreate('5446546', payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C19279 (-) Without money card_rub + valid wallet ', async () => {
    const { data } = await banking.withdrawalCreate('0000111122223333', payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });

  it(' (-) Without money card_rub + amount = string ', async () => {
    const { data } = await banking.withdrawalCreate('0000111122223333', payment_system, currency, '100');
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });
});
