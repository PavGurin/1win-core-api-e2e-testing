import { register } from '../../../../../src/methods/register';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';

const currency = 'RUB';
const payment_system = 'webmoney_rub';

describe('Withdrawal create with valid test cases ', () => {
  before(async () => {
    await register.oneClickReg();
  });
  it('C19335 (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(10, 'R123456789000',
      payment_system, currency);
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });
  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(100, '5446546', payment_system, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
