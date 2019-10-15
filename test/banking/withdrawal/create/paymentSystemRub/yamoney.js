import { register } from '../../../../../src/methods/register';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { getNewSocket } from '../../../../global';

const currency = 'RUB';
const payment_system = 'yamoney_rub';


describe('Withdrawal create with valid test cases ', () => {
  let socket;
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  it('C19334 - (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(socket, '4100100000000', payment_system, currency, 10);
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });

  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(socket, '5446546', payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
