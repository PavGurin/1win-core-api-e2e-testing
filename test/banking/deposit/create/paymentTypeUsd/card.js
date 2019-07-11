import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { userList } from '../../../../../src/methods/userList';

// beforeEach('Регистрация нового пользователя перед началом каждого теста', async () => {
//     const {user} = await register.oneClickReg();
//     }
// );
const paymentType = 'card_rub';
const currency = 'USD';

describe.skip('Create deposite for card_rub - USD @master', () => {
  before(async () => {
    await userList.loginWithRealMoney();
  });

  it(' (+) amount = 100 & wallet = empty', async () => {
    const { data } = await banking.depositCreateRub(
      100, '', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      100.01, '123 autotests', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(
      2000, 'порпорпорпэ', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 2000);
  });

  it(' min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(10, '123234345456 etryrt', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 10);
  });

  it('> min amount & wallet = symbols', async () => {
    const { data } = await banking.depositCreateRub(11, '12№%:№%:45456etryrt', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 11);
  });

  it(' max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(100000, '09090909999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100000);
  });

  it('< max amount & wallet = numbers', async () => {
    const { data } = await banking.depositCreateRub(99999, '0[[[?<><?999',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 99999);
  });

  // Не знаю, какой должен быть результат
  it(' wallet = undefined', async () => {
    const { data } = await banking.depositCreateRub(100, undefined,
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });

  it(' without currency', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '00001111222223333',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 100);
  });
});

describe.skip('Create deposite for card_rub invalid - USD', () => {
  it(' amount = 0', async () => {
    const { data } = await banking.depositCreateRub(0, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' amount = null', async () => {
    const { data } = await banking.depositCreateRub(null, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' amount = empty', async () => {
    const { data } = await banking.depositCreateRub(' ', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' amount = undefined', async () => {
    const { data } = await banking.depositCreateRub(undefined, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' amount = latinic', async () => {
    const { data } = await banking.depositCreateRub('fjfj', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
  });

  it(' amount = string', async () => {
    const { data } = await banking.depositCreateRub('50', '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(0.6, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' 1 < amount < min amount', async () => {
    const { data } = await banking.depositCreateRub(9, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount > max amount', async () => {
    const { data } = await banking.depositCreateRub(100001, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount doudle > max amount ', async () => {
    const { data } = await banking.depositCreateRub(100000.56, '',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' wallet = null', async () => {
    const { data } = await banking.depositCreateRub(100, null,
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  it(' wallet = long string', async () => {
    const { data } = await banking.depositCreateRub(10,
      // TODO посмотреть количество символов доступных в кошельке
      '1231231231231231453453345345342312312312312123123123123',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверный формат кошелька');
  });

  // Не знаю что тут должно быть
  it(' incorrect paymentType = card_rub_test', async () => {
    const { data } = await banking.depositCreateRub(10,
      // TODO посмотреть количество символов доступных в кошельке
      '3123123123',
      'card_rub_test', currency);
    // console.log(data);
    checkErrMsg(data, 400, '?????');
  });
});
