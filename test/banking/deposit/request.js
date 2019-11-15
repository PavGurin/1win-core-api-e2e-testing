import { register } from '../../../src/methods/register';
import { checkErrMsg } from '../../../src/responseChecker';
import { banking } from '../../../src/methods/banking';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });


  it('C19377 (-) with incorrect hash ', async () => {
    await banking.depositCreateRequest('', paymentType, currency, 100);
    const { data } = await socket.send('BANKING:deposit-request', { h: 'gjhg' });
    // console.log(data);
    checkErrMsg(data, 404, 'Запрос депозита не найден');
  });
});
