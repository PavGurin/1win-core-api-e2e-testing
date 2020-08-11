import { register } from '../../../../../src/methods/register';
import { banking } from '../../../../../src/methods/banking';
import { checkErrMsg } from '../../../../../src/responseChecker';
import { getLastDeposit, successDbDeposit } from '../../../../../src/expects/exBanking';

const paymentType = 'qiwi_rub';
const currency = 'RUB';
let user = {};

describe('Create deposite for qiwi_rub - RUB', () => {
  beforeEach(async () => {
    user = await register.oneClickReg();
  });

  it('C22620 - (+) amount = 1000 & wallet = (+7)phone', async () => {
    await banking.depositCreate('+79001234567', paymentType, currency, 1000);
    await successDbDeposit(user.data.id, 1000, '79001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22623 min amount & wallet = (+91)', async () => {
    await banking.depositCreate('+919001234567', paymentType, currency, 100);
    await successDbDeposit(user.data.id, 100, '919001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22624 - > min amount & wallet = (+994)', async () => {
    await banking.depositCreate('+9949001234567', paymentType, currency, 110);
    await successDbDeposit(user.data.id, 110, '9949001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22625 - max amount & wallet = (+82)', async () => {
    await banking.depositCreate('+829001234567', paymentType, currency, 250000);
    await successDbDeposit(user.data.id, 250000, '829001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22626 - < max amount & wallet = (+372)', async () => {
    await banking.depositCreate('+3729001234567', paymentType, currency, 249999);
    await successDbDeposit(user.data.id, 249999, '3729001234567',
      'qiwi_rub', 'RUB');
  });


  it('C22628 - amount & wallet = (+374)', async () => {
    await banking.depositCreate('+3749001234567', paymentType, currency, 105);
    await successDbDeposit(user.data.id, 105, '3749001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22710 - amount & wallet = (+44)', async () => {
    await banking.depositCreate('+449001234567', paymentType, currency, 150.31);
    await successDbDeposit(user.data.id, 150.31, '449001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22711 - amount & wallet = (+998)', async () => {
    await banking.depositCreate('+9989001234567', paymentType, currency, 134.18);
    await successDbDeposit(user.data.id, 134.18, '9989001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22712 - amount & wallet = (+972)', async () => {
    await banking.depositCreate('+9729001234567', paymentType, currency, 150);
    await successDbDeposit(user.data.id, 150, '9729001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22713 - amount & wallet = (+66)', async () => {
    await banking.depositCreate('+669001234567', paymentType, currency, 250);
    await successDbDeposit(user.data.id, 250, '669001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22714 - amount & wallet = (+90)', async () => {
    await banking.depositCreate('+909001234567', paymentType, currency, 784);
    await successDbDeposit(user.data.id, 784, '909001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22715 - amount & wallet = (+81)', async () => {
    await banking.depositCreate('+8149001234567', paymentType, currency, 365);
    await successDbDeposit(user.data.id, 365, '8149001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22716 - amount & wallet = (+1)', async () => {
    await banking.depositCreate('+19001234567', paymentType, currency, 333.3);
    await successDbDeposit(user.data.id, 333.3, '19001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22717 - amount & wallet = (+507)', async () => {
    await banking.depositCreate('+5079001234567', paymentType, currency, 111.1);
    await successDbDeposit(user.data.id, 111.1, '5079001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22718 - amount & wallet = (+77)', async () => {
    await banking.depositCreate('+779001234567', paymentType, currency, 254.63);
    await successDbDeposit(user.data.id, 254.63, '779001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22719 - amount & wallet = (+380)', async () => {
    await banking.depositCreate('+3809001234567', paymentType, currency, 555);
    await successDbDeposit(user.data.id, 555, '3809001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22720 - amount & wallet = (+371)', async () => {
    await banking.depositCreate('+3719001234567', paymentType, currency, 777);
    await successDbDeposit(user.data.id, 777, '3719001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22721 - amount & wallet = (+370)', async () => {
    await banking.depositCreate('+3709001234567', paymentType, currency, 1234);
    await successDbDeposit(user.data.id, 1234, '3709001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22722 - amount & wallet = (+996)', async () => {
    await banking.depositCreate('+9969001234567', paymentType, currency, 666.13);
    await successDbDeposit(user.data.id, 666.13, '9969001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22723 - amount & wallet = (+9955)', async () => {
    await banking.depositCreate('+99559001234567', paymentType, currency, 483);
    await successDbDeposit(user.data.id, 483, '99559001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22724 - amount & wallet = (+992)', async () => {
    await banking.depositCreate('+9929001234567', paymentType, currency, 199.9);
    await successDbDeposit(user.data.id, 199.9, '9929001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22725 - amount & wallet = (+373)', async () => {
    await banking.depositCreate('+3739001234567', paymentType, currency, 110);
    await successDbDeposit(user.data.id, 110, '3739001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22726 - amount & wallet = (+84)', async () => {
    await banking.depositCreate('+849001234567', paymentType, currency, 10000);
    await successDbDeposit(user.data.id, 10000, '849001234567',
      'qiwi_rub', 'RUB');
  });

  it('C22727 - < max amount & wallet = valid short number', async () => {
    await banking.depositCreate('+79001234', paymentType, currency, 249999);
    await successDbDeposit(user.data.id, 249999, '79001234',
      'qiwi_rub', 'RUB');
  });

  it('C2196279 wallet = undefined', async () => {
    await banking.depositCreate(undefined, paymentType, currency, 1000);
    const dbResult = await getLastDeposit(user.data.id);
    expect(dbResult.length).toEqual(0);
  });
});

describe('Create deposite for qiwi_rub invalid - RUB', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it('C22635 - amount double < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 10.6);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22636 - amount < min amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 99);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22637 - amount > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 250001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C22638 - amount double > max amount', async () => {
    const { data } = await banking.depositCreate('+79001234567', paymentType, currency, 250000.000001);
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });


  it('C22622  wallet = (8)phone', async () => {
    const data = await banking.depositCreate('89001234567', paymentType, currency, 2000);
    // console.log(data);
    expect(data.data.status).toEqual(400);
    expect(data.data.message).toEqual('Неверный формат кошелька');
  });
});
