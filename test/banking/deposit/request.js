import { register } from '../../../src/methods/register';
import { checkErrMsg } from '../../../src/responseChecker';
import { banking } from '../../../src/methods/banking';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it('C19377 (-) with incorrect hash ', async () => {
    await banking.depositCreateRequestRub(100, '', paymentType, currency);
    const { data } = await socket.send('BANKING:deposit-request', { h: 'gjhg' });
    // console.log(data);
    checkErrMsg(data, 404, 'Запрос депозита не найден');
  });
});
