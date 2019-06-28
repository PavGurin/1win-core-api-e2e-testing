import { expect } from 'chai';
import { userList } from '../../../src/methods/userList';
import { checkErrMsg } from '../../../src/responseChecker';

describe('Convert', () => {
  before(async () => {
    await userList.loginWithRubUsd();
  });

  // глобальная комиссия на переводы = 5%

  it('C19340 Create before login', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 100,
      senderCurrency: 'RUB',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19341 Create before login not enough money', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 0,
      senderCurrency: 'RUB',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Некорректное значение amount');
  });

  it('55C19341 Create before login not enough money', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 100,
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19342 Create after login valid request 100 RUB -> USD', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 100,
      senderCurrency: 'RUB',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19343 Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 'tuytuyty',
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, amount should have a type of number, but found string');
    expect(data.status).equal(400);
  });

  it(' Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'rrrr',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, senderCurrency is invalid');
    expect(data.status).equal(400);
  });

  it(' () Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'RUB',
      receiverCurrency: null,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, receiverCurrency is required, no default value provided');
    expect(data.status).equal(400);
  });

  it(' ()oo Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'RUB',
      receiverCurrency: undefined,
    });
    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, receiverCurrency is required, no default value provided');
    expect(data.status).equal(400);
  });

  it(' oo Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'RUB',
      receiverCurrency: 'EUR',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('0 Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'EUR',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });


  it('C19343 - Create after login valid request 1 USD -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: '1',
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19344 Create after login valid request 1 USD -> USD ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 1,
      senderCurrency: 'USD',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19345 Create after login valid request 1 RUB -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 1,
      senderCurrency: 'RUB',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Некорректный формат валюты');
  });

  it('C19346 Create after login valid request 100 RUB -> RUB ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 100,
      senderCurrency: 'RUB',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Некорректный формат валюты');
  });

  it('C19347 Create after login valid request 10000 RUB -> USD(not enough money) ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 10000,
      senderCurrency: 'RUB',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });

  it('C19348 Create after login valid request 1000 USD -> RUB(not enough money) ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 1000,
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });

  it('C19349 Create after login valid request 0.9 USD -> RUB(enough money) ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 0.9,
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    expect(data.email).not.equal(null);
    expect(data.amount).not.equal(0);
  });

  it('C19350 Create after login valid request negative amount USD -> RUB(enough money) ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: -0.9,
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Некорректное значение amount');
  });

  it('C19351 Create after login valid request negative amount RUB -> USD(enough money) ', async () => {
    const { data } = await socket.send('BANKING:convert-create', {
      amount: -100.9,
      senderCurrency: 'RUB',
      receiverCurrency: 'USD',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Некорректное значение amount');
  });
});

describe('Convert12', () => {
  it('not money ', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BANKING:convert-create', {
      amount: 1.9,
      senderCurrency: 'USD',
      receiverCurrency: 'RUB',
    });
    // console.log(data);
    checkErrMsg(data, 403, 'Недостаточно средств');
  });
});
