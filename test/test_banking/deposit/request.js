import {register} from '../../../src/methods/register';
import {checkErrMsg} from '../../../src/responseChecker';
import {banking} from '../../../src/methods/banking';

const currency = 'RUB';
const paymentType = 'card_rub';

describe('Deposit requests', () => {
  before(async () => {
    await register.one_click_reg();
  });

  it('C19377 (-) with incorrect hash ', async () => {
    await banking.deposit_create_request(100, '', paymentType, currency);
    const {data} = await socket.send('BANKING:deposit-request', {h: 'gjhg'});
    // console.log(data);
    checkErrMsg(data, 404, 'Запрос депозита не найден');
  });
});
