import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'megafon_rub';
const currency = 'RUB';

describe.skip('Create deposite for megafon_rub - RUB @master', () => {
  before(async () => {
    await register.oneClickReg();
  });

  it('C22526 - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100, '79215598286', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22527 - (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100.01, '79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it('C22528 - amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      2000, '89001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it('C22529 - min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(10,
      '79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('C22530 - > min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRequestRub(11,
      '79215598286', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it('C22531 - max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(15000,
      '+79001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15000);
  });

  it('C22532 - < max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRequestRub(14999, '+79001234567',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });

  it('C22533 - without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+79001234567',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it('C22534 - < max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreateRequestRub(14999, '+79001234',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe.skip('Create deposite for megafon_rub invalid - RUB', () => {
  it('C22544 - amount = 0', async () => {
    const { data } = await banking.depositCreateRequestRub(0, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22545 - amount = null', async () => {
    const { data } = await banking.depositCreateRequestRub(null, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22546 - amount = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(' ', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it('C22547 - amount = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(undefined, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C22548 - amount = latanic', async () => {
    const { data } = await banking.depositCreateRequestRub('fjfj', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it('C22549 - amount = string', async () => {
    const { data } = await banking.depositCreateRequestRub('50', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22550 - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(0.6, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22551 - amount < min amount', async () => {
    const { data } = await banking.depositCreateRequestRub(9, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22552 - amount > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(15001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22553 - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRequestRub(15000.000001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22554 - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRequestRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22555 - wallet = null', async () => {
    const { data } = await banking.depositCreateRequestRub(100, null,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22557 - wallet = empty', async () => {
    const { data } = await banking.depositCreateRequestRub(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it('C22558 - wallet = number', async () => {
    const { data } = await banking.depositCreateRequestRub(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it('C22559 wallet = short phone', async () => {
    const { data } = await banking.depositCreateRequestRub(100, '+7123',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it('C22556 - incorrect paymentType = megafon_rub_test', async () => {
    const { data } = await banking.depositCreateRequestRub(1,
      // TODO посмотреть количество символов доступных в кошельке
      '+79001234567',
      'megafon_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });

  // Не знаю что тут должно быть
  it('C22560 wallet = long phone', async () => {
    const { data } = await banking.depositCreateRequestRub(100,
      // TODO посмотреть количество символов доступных в кошельке
      '+790012345670909',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });
});
