import { banking } from '../../../../src/methods/banking';
import { checkErrMsg } from '../../../../src/responseChecker';
import { register } from '../../../../src/methods/register';

const paymentType = 'beeline_rub';
const currency = 'RUB';

describe('Invalid data ', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });
  it('C22494 - amount = 0', async () => {
    const { data } = await banking.depositCreate(0, '+79215598256',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22495 - amount = null', async () => {
    const { data } = await banking.depositCreate(null, '+79215598266',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22496 - amount = empty', async () => {
    const { data } = await banking.depositCreate(' ', '79215598276',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22497 - amount = undefined', async () => {
    const { data } = await banking.depositCreate(undefined, '79215598206',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22498 - amount = string', async () => {
    const { data } = await banking.depositCreate('fjfj', '79215598296',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22506 - wallet = empty', async () => {
    const { data } = await banking.depositCreate(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22507 - wallet = number', async () => {
    const { data } = await banking.depositCreate(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('C22508 - wallet = short phone', async () => {
    const { data } = await banking.depositCreate(100, +7123,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  // Не знаю что тут должно быть
  it('C22509 - incorrect paymentType = beeline_rub_test', async () => {
    const { data } = await banking.depositCreate(1,
      '+79215598286',
      'beeline_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный способ оплаты');
  });
});
