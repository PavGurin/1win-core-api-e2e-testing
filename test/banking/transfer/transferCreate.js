import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { checkErrMsg } from '../../../src/responseChecker';
import { logOut } from '../../../src/methods/user';

describe('Transfer with money - RUB', () => {
  beforeAll(async () => {
    await logOut();
    await userList.loginWithRealMoney();
  });

  it('C19371 (+) With money', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 100,
      currency: 'RUB',
    });
    // console.log(data);
    expect(data.confirmationRequested).equal(true);
    expect(data.email).not.equal(null);
  });

  it('C19375 (+) With money, currency = null and amount > 1000', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 19990000,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });

  it('C28690 - (+) amount > 20 ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 21,
    });
    // console.log(data);
    expect(data.confirmationRequested).equal(true);
    expect(data.email).not.equal(null);
  });

  it('C28691 - (-) 19 > amount > 20 ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 19.68,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });


  it('C27042 (-) amount < 20 ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 19,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C27043 - without amount ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it('C27044 - without targetEmail ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });
});

describe.skip('Transfer with money - USD', () => {
  beforeAll(async () => {
    await userList.loginWithRubUsd();
  });

  it('C19373 (+) With money + USD, amount = 0.1 USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 0.1,
      currency: 'USD',
    });
    // console.log(data);

    expect(data.confirmationRequested).equal(true);
    expect(data.email).not.equal(null);
  });

  it('C19372 (+) With money + USD, amount = 1 USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 100000,
      currency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });

  it('C19368 Without money , not enough amount + USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 0.01,
      currency: 'EUR',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C19369 (-) Without money , enough amount + USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 1000000,
      currency: 'EUR',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });
});

describe('Transfer without money', () => {
  beforeAll(async () => {
    await register.oneClickReg();
  });

  it('C19367 (-) Without money , not enough amount + RUB', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 1,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it('C19370 (-) Without money , enough amount + RUB', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      targetEmail: 'test_transfer@mailinator.com',
      amount: 100,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });
});
