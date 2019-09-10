import { banking } from '../../../../../src/methods/banking';
import { successDepositCreate } from '../../../../../src/expects/exBanking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getNewSocket } from '../../../../global';
import { register } from '../../../../../src/methods/register';

const paymentType = 'qiwi_rub';
const currency = 'USD';

describe.skip('Create deposite for qiwi_rub - USD', () => {
  beforeEach(async () => {
    socket = await getNewSocket();
    await register.oneClickRegUSD(socket);
  });

  afterEach(() => socket.disconnect());

  it(' (+) amount = 100 & wallet = (+7)phone', async () => {
    const { data } = await banking.depositCreate(
      100, '+79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 100);
  });

  it(' (+) amount = 100.01 & wallet = (7)phone', async () => {
    const { data } = await banking.depositCreate(
      100.01, '79001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 100.01);
  });

  it(' amount = 2000 & wallet = (8)phone', async () => {
    const { data } = await banking.depositCreate(
      2000, '89001234567', paymentType, currency,
    );
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 2000);
  });

  it(' min amount & wallet =  = (+91)', async () => {
    const { data } = await banking.depositCreate(10,
      '+919001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 10);
  });

  it('> min amount & wallet = (+994)', async () => {
    const { data } = await banking.depositCreate(11,
      '+9949001234567', paymentType, currency);

    // console.log(data);
    successDepositCreate(data, currency, paymentType, 11);
  });

  it(' max amount & wallet = (+82)', async () => {
    const { data } = await banking.depositCreate(15000,
      '+829001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15000);
  });

  it('< max amount & wallet = (+372)', async () => {
    const { data } = await banking.depositCreate(14999, '+3729001234567',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 14999);
  });

  it(' without currency & wallet = (+375)', async () => {
    const { data } = await socket.send('BANKING:deposit-create', {
      amount: '100',
      wallet: '+3759001234567',
      paymentType,
    });
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 100);
  });

  it(' max amount & wallet = (+374)', async () => {
    const { data } = await banking.depositCreate(15, '+3749001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+44)', async () => {
    const { data } = await banking.depositCreate(15, '+449001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+998)', async () => {
    const { data } = await banking.depositCreate(15, '+9989001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+972)', async () => {
    const { data } = await banking.depositCreate(15, '+9729001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+66)', async () => {
    const { data } = await banking.depositCreate(15, '+669001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+90)', async () => {
    const { data } = await banking.depositCreate(15, '+909001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+81)', async () => {
    const { data } = await banking.depositCreate(15, '+8149001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+1)', async () => {
    const { data } = await banking.depositCreate(15, '+19001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+507)', async () => {
    const { data } = await banking.depositCreate(15, '+5079001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+77)', async () => {
    const { data } = await banking.depositCreate(15, '+779001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency, paymentType, 15);
  });

  it(' max amount & wallet = (+380)', async () => {
    const { data } = await banking.depositCreate(15,
      '+3809001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+371)', async () => {
    const { data } = await banking.depositCreate(15,
      '+3719001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+370)', async () => {
    const { data } = await banking.depositCreate(15,
      '+3709001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+996)', async () => {
    const { data } = await banking.depositCreate(15,
      '+9969001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+9955)', async () => {
    const { data } = await banking.depositCreate(15,
      '+99559001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+992)', async () => {
    const { data } = await banking.depositCreate(15,
      '+9929001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+373)', async () => {
    const { data } = await banking.depositCreate(15,
      '+3739001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it(' max amount & wallet = (+84)', async () => {
    const { data } = await banking.depositCreate(15,
      '+849001234567', paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 15);
  });

  it('< max amount & wallet = valid short number', async () => {
    // TODO узнать валидный короткий номер городского телефона
    const { data } = await banking.depositCreate(14999, '+79001234',
      paymentType, currency);
    // console.log(data);
    successDepositCreate(data, currency,
      paymentType, 14999);
  });
});

describe.skip('Create deposite for qiwi_rub invalid - USD', () => {
  it(' amount double < min amount', async () => {
    const { data } = await banking.depositCreate(0.6, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is invalid');
  });

  it(' amount < min amount', async () => {
    const { data } = await banking.depositCreate(9, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount > max amount', async () => {
    const { data } = await banking.depositCreate(15001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' amount double > max amount', async () => {
    const { data } = await banking.depositCreate(15000.000001, '+79001234567',
      paymentType, currency);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });
});
