import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';

const paymentType = 'qiwi_rub';
const currency = 'RUB';

describe.skip('Create deposite for qiwi_rub - RUB @master', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });


  it(' - (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreateRequest('+79001234567', paymentType, currency, 100);
    // console.log
    successDepositCreate(data, currency, paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreateRequest('79001234567', paymentType, currency, 100.01);
    // console.log
    successDepositCreate(data, currency, paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreateRequest('89001234567', paymentType, currency, 2000);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 2000);
  });

  it(' min amount & wallet = (+91)', async () => {
    const { data } = await banking.depositCreateRequest('+919001234567', paymentType, currency, 10);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 10);
  });

  it(' - > min amount & wallet = (+994)', async () => {
    const { data } = await banking.depositCreateRequest('+9949001234567', paymentType, currency, 11);

    // console.log(data);
    successDepositCreate(data, currency, paymentType, 11);
  });

  it(' - max amount & wallet = (+82)', async () => {
    const { data } = await banking.depositCreateRequest('+829001234567', paymentType, currency, 15000);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15000);
  });

  it(' - < max amount & wallet = (+372)', async () => {
    const { data } = await banking.depositCreateRequest('+3729001234567', paymentType, currency, 14999);
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
    const { data } = await banking.depositCreateRequest('+3749001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+44)', async () => {
    const { data } = await banking.depositCreate('+449001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+998)', async () => {
    const { data } = await banking.depositCreate('+9989001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+972)', async () => {
    const { data } = await banking.depositCreate('+9729001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+66)', async () => {
    const { data } = await banking.depositCreate('+669001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+90)', async () => {
    const { data } = await banking.depositCreate('+909001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+81)', async () => {
    const { data } = await banking.depositCreate('+8149001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+1)', async () => {
    const { data } = await banking.depositCreate('+19001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+507)', async () => {
    const { data } = await banking.depositCreate('+5079001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+77)', async () => {
    const { data } = await banking.depositCreate('+779001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' - amount & wallet = (+380)', async () => {
    const { data } = await banking.depositCreate('+3809001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+371)', async () => {
    const { data } = await banking.depositCreate('+3719001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+370)', async () => {
    const { data } = await banking.depositCreate('+3709001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+996)', async () => {
    const { data } = await banking.depositCreate('+9969001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+9955)', async () => {
    const { data } = await banking.depositCreate('+99559001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+992)', async () => {
    const { data } = await banking.depositCreate('+9929001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+373)', async () => {
    const { data } = await banking.depositCreate('+3739001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - amount & wallet = (+84)', async () => {
    const { data } = await banking.depositCreate('+849001234567', paymentType, currency, 15);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' - < max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreate('+79001234', paymentType, currency, 14999);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe.skip('Create deposite for qiwi_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });
  it(' - amount = 0', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 0);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = null', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, null);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = empty', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, ' ');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' - amount = undefined', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, undefined);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - amount = string', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 'fjfj');
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });


  it(' - amount = number - string', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, '50');
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 0.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 9);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 15001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 15000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - wallet = undefined', async () => {
    const { data } = await banking.depositCreate(undefined, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = null', async () => {
    const { data } = await banking.depositCreate(null, paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = empty', async () => {
    const { data } = await banking.depositCreate('', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' - wallet = number', async () => {
    const { data } = await banking.depositCreate(111122223330000,
      paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, wallet should have a type of string, but found number');
  });

  it(' - wallet = short phone', async () => {
    const { data } = await banking.depositCreate('+7123', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' wallet = long phone', async () => {
    const { data } = await banking.depositCreate('+797798778987', paymentType, currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' - incorrect paymentType = qiwi_rub_test', async () => {
    const { data } = await banking.depositCreate('+79001234567', 'qiwi_rub_test', currency, 100);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
