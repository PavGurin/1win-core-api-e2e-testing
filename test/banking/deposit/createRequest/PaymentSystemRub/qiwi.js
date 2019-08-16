import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'qiwi_rub';
const currency = 'RUB';

describe.skip('Create deposite for qiwi_rub - RUB @master', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it(' - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100, '+79001234567', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency, paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      100.01, '79001234567', paymentType, currency,
    );
    // console.log
    successDepositCreate(data, currency, paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRequestRub(
      2000, '89001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 2000);
  });

  it(' min amount & wallet = (+91)', async () => {
    const { data } = await banking.depositCreateRequestRub(10,
      '+919001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 10);
  });

  it(' - > min amount & wallet = (+994)', async () => {
    const { data } = await banking.depositCreateRequestRub(11,
      '+9949001234567', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency, paymentType, 11);
  });

  it(' - max amount & wallet = (+82)', async () => {
    const { data } = await banking.depositCreateRequestRub(15000,
      '+829001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15000);
  });

  it(' - < max amount & wallet = (+372)', async () => {
    const { data } = await banking.depositCreateRequestRub(14999, '+3729001234567',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 14999);
  });

  it(' - without currency & wallet = (+375)', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+3759001234567',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 100);
  });

  it(' - amount & wallet = (+374)', async () => {
    const { data } = await banking.depositCreateRequestRub(15, '+3749001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+44)', async () => {
    const { data } = await banking.depositCreateRub(15, '+449001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+998)', async () => {
    const { data } = await banking.depositCreateRub(15, '+9989001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+972)', async () => {
    const { data } = await banking.depositCreateRub(15, '+9729001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+66)', async () => {
    const { data } = await banking.depositCreateRub(15, '+669001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+90)', async () => {
    const { data } = await banking.depositCreateRub(15, '+909001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+81)', async () => {
    const { data } = await banking.depositCreateRub(15, '+8149001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+1)', async () => {
    const { data } = await banking.depositCreateRub(15, '+19001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+507)', async () => {
    const { data } = await banking.depositCreateRub(15, '+5079001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+77)', async () => {
    const { data } = await banking.depositCreateRub(15, '+779001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+380)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+3809001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+371)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+3719001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+370)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+3709001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+996)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+9969001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+9955)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+99559001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+992)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+9929001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+373)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+3739001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+84)', async () => {
    const { data } = await banking.depositCreateRub(15,
      '+849001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - < max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreateRub(14999, '+79001234',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe.skip('Create deposite for qiwi_rub invalid - RUB', () => {
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });


  it(' - amount = number - string', async () => {
    const { data } = await banking.depositCreateRub('50', '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(15001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreateRub(15000.000001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreateRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreateRub(100, null,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(100, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = number', async () => {
    const { data } = await banking.depositCreateRub(100, 111122223330000,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it(' - wallet = short phone', async () => {
    const { data } = await banking.depositCreateRub(100, '+7123',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' wallet = long phone', async () => {
    const { data } = await banking.depositCreateRub(100,
      '+797798778987',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = qiwi_rub_test', async () => {
    const { data } = await banking.depositCreateRub(100,
      // TODO посмотреть количество символов доступных в кошельке
      '+79001234567',
      'qiwi_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
