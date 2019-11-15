import { userList } from '../../../src/methods/userList';
import { register } from '../../../src/methods/register';
import { checkErrMsg } from '../../../src/responseChecker';


// новые тесты для которых пока нет id в тестрейле
describe('Transfer with money - RUB = account', () => {
  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });

  it(' (+) With money email', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 100,
      currency: 'RUB',
    });
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
    expect(data.email).not.toEqual(null);
  });

  it(' (+) With money id user', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: '192',
      amount: 100,
      currency: 'RUB',
    });
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
    expect(data.email).not.toEqual(null);
  });

  it(' (+) With money, currency = null and amount > 1000 user email', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 1999000000,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });

  it(' (+) With money, currency = null and amount > 1000 user id', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: '192',
      amount: 1999000000,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });

  it(' - (+) amount > 20 user email ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 21,
    });
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
    expect(data.email).not.toEqual(null);
  });

  it(' - (+) amount > 20 user id', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: '192',
      amount: 21,
    });
    // console.log(data);
    expect(data.confirmationRequested).toEqual(true);
    expect(data.email).not.toEqual(null);
  });

  it(' - (-) 19 > amount > 20 user email', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 19.68,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - (-) 19 > amount > 20 user id', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: '192',
      amount: 19.68,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' unexist user id', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: '2',
      amount: 200,
    });
    // console.log(data);
    checkErrMsg(data, 404, 'Получатель не найден');
  });

  it(' account = null', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: null,
      amount: 200,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, account is required');
  });

  it(' account = undefined', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: undefined,
      amount: 200,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, account is required');
  });


  it(' - (-) amount < 20 ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 19,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' - without amount ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });

  it(' - without targetEmail ', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount is required, no default value provided');
  });
});

describe('Transfer with money - USD - account', () => {
  beforeEach(async () => {
    await userList.loginWithRubUsd();
  });

  it(' (+) With money + USD, amount = 0.1 USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 0.1,
      currency: 'USD',
    });
    // console.log(data);

    expect(data.confirmationRequested).toEqual(true);
    expect(data.email).not.toEqual(null);
  });

  it(' (+) With money + USD, amount = 1 USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 100000,
      currency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });

  it(' Without money , not enough amount + USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 0.01,
      currency: 'EUR',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' (-) Without money , enough amount + USD', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 1000000,
      currency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });
});

describe('Transfer without money', () => {
  beforeEach(async () => {
    await register.oneClickReg();
  });

  it(' (-) Without money , not enough amount + RUB', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 1,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Неверная сумма');
  });

  it(' (-) Without money , enough amount + RUB', async () => {
    const { data } = await socket.send('BANKING:transfer-create', {
      account: 'test_transfer@mailinator.com',
      amount: 100,
      currency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Недостаточно средств');
  });
});
