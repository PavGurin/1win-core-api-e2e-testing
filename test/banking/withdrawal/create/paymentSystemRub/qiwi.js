import { userList } from '../../../../../src/methods/userList';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';
import { getNewSocket } from '../../../../global';

const currency = 'RUB';
const payment_system = 'qiwi_rub';


describe('Withdrawal create with valid test cases ', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await userList.loginWithRealMoney(socket);
  });

  it('C19332 - (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(socket, '+9729001234567', payment_system, currency, 10);
    // console.log(data);
    successWithdrawalCreate(data);
  });

  it(' (-) With money invalid', async () => {
    const { data } = await banking.withdrawalCreate(socket, '5446546', payment_system, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
