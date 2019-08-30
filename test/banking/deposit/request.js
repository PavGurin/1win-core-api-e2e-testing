import { register } from '../../../src/methods/register';
import { checkErrMsg } from '../../../src/responseChecker';
import { banking } from '../../../src/methods/banking';
import { getNewSocket } from '../../global';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  let socket;

  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickReg(socket);
  });

  afterEach(() => socket.disconnect());

  it('C19377 (-) with incorrect hash ', async () => {
    await banking.depositCreateRequest(100, '', paymentType, currency);
    const { data } = await socket.send('BANKING:deposit-request', { h: 'gjhg' });
    // console.log(data);
    checkErrMsg(data, 404, 'Запрос депозита не найден');
  });
});
