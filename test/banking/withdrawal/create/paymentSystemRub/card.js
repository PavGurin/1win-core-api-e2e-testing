import { register } from '../../../../../src/methods/register';
import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';

const currency = 'RUB';
const paymentSystem = 'card_rub';


describe('Withdrawal create with valid test cases ', () => {
  before(async () => {
    await userList.loginWithRealMoney();
  });

  it('C19325 (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(100, '0000111122223333',
      paymentSystem, currency);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it('C19324 (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(100, '5446546', paymentSystem, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad Request.');
  });
});

describe('Withdrawal create with invalid test cases ', () => {
  before(async () => {
    await register.oneClickReg();
  });


  it('(-) Without money, wallet = string', async () => {
    const { data } = await banking.withdrawalCreate(100, 5446546, paymentSystem, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('(-) Without money ', async () => {
    const { data } = await banking.withdrawalCreate(100, '5446546', paymentSystem, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad Request.');
  });

  it('C19279 (-) Without money card_rub + valid wallet ', async () => {
    const { data } = await banking.withdrawalCreate(100, '0000111122223333', paymentSystem, currency);
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });

  it(' (-) Without money card_rub + amount = string ', async () => {
    const { data } = await banking.withdrawalCreate('100', '0000111122223333', paymentSystem, currency);
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });
});
