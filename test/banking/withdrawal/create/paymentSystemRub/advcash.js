import { userList } from '../../../../../src/methods/userList';
import { banking } from '../../../../../src/methods/banking';
import { successWithdrawalCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';

const currency = 'RUB';
const payment_system = 'advcash_rub';


describe('Withdrawal create with valid test cases ', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await userList.loginWithRealMoney(socket);
  });

  it('C19337 - (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(socket, 'lina.solodova@gmail.com', payment_system, currency, 99.99);
    // console.log
    successWithdrawalCreate(data);
  });

  it(' (-) With money  invalid', async () => {
    const { data } = await banking.withdrawalCreate(socket, 'lina.solodova@gmail.com', payment_system, currency, 10);
    // console.log
    successWithdrawalCreate(data);
  });

  it(' (+) With money card_rub + valid wallet', async () => {
    const { data } = await banking.withdrawalCreate(socket, 'lina.solodova@gmail.com', payment_system, currency, 100);
    const { data2 } = await socket.send('BANKING:withdrawal-check', { amount: 100 });
    console.log(data2);
    successWithdrawalCreate(data);
  });

  it(' (-) With money valid', async () => {
    const { data } = await banking.withdrawalCreate(socket, 'lina.solodova@gmail.com', payment_system, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
