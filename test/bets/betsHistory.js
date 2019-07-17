import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';
import { getMatchHistory } from '../../src/methods/matchStorage';

describe('Bets history', () => {
  it('C27571 (+) user w/o bet history default filter', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory();
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27572 (-) no order value', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory({
      order: null,
    });
    // console.log(data);
    expect(data.status).equal(400);
    expect(data.message).equal('Bad request, order is required, no default value provided');
  });

  it('C27573 (-) no limit value', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory({
      limit: null,
    });
    // console.log(data);
    expect(data.status).equal(400);
    expect(data.message).equal('Bad request, limit is required, no default value provided');
  });

  it('C27574 (+) user w/o bet history asc order', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory({
      order: ['id', 'ASC'],
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27575 (+) user w/o bet history, bet type \'express\'', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory({
      where: {
        betType: ['express'],
      },
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27576 (+) user w/o bet history, bet type \'ordinary\'', async () => {
    const { data: regReq } = await register.oneClickReg();
    await userList.loginWithParams(regReq.email, regReq.password);
    const { data } = await getMatchHistory({
      where: {
        betType: ['ordinary'],
      },
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27577 (+) user with bet history, bet type \'ordinary\'', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await getMatchHistory({
      where: {
        betType: ['ordinary'],
      },
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === 'ordinary')).equal(true);
  });

  /** Bets statuses:
   status 0 - opened, 1 - lost, 2 - returned, 3 - won
   * */

  // TODO 'service' should be fixed to run ALL filters
  it.skip('C27578 (+) all filters with all available values', async () => {
    await userList.loginWithRub();
    const { data: { betsMap } } = await socket.send('BETS:bets-history', {
      language: null,
      limit: [0, 20],
      order: ['id', 'DESC'],
      // полные настройки фильтра в блоке 'where'
      where: {
        status: [0, 1, 2, 3],
        service: ['prematch'],
        betType: ['ordinary', 'express'],
        dateFrom: 0,
        // dateTo:27062019,
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(20);
  });

  it.skip('C27579 (+) only \'lost\' bets status (status = 1)', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await socket.send('BETS:bets-history', {
      language: 'ru',
      limit: [0, 5],
      order: ['id', 'DESC'],

      where: {
        status: [0],
        // service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(0);
    expect(Object.values(betsMap).every(({ status }) => status === 1)).equal(true);
  });

  it.skip('C27580 (+) only \'returned\' bets status (status = 2)', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await socket.send('BETS:bets-history', {
      language: null,
      limit: [0, 15],
      order: ['id', 'DESC'],

      where: {
        status: [2],
        // service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(15);
    expect(Object.values(betsMap).every(({ status }) => status === 2)).equal(true);
  });

  it.skip('C27581 (+) only \'won\' bets status (status = 3)', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await socket.send('BETS:bets-history', {
      language: null,
      limit: [0, 15],
      order: ['id', 'DESC'],

      where: {
        status: [1],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(15);
    expect(Object.values(betsMap).every(({ status }) => status === 3)).equal(true);
  });

  it('C27582 (-) [0,0] limit', async () => {
    await userList.loginWithRub();
    const { data: { betsMap } } = await getMatchHistory({
      limit: [0, 0],
    });
    // console.log(betsMap);
    expect(betsMap).to.be.empty;
  });

  it('C27583 (-) limits \'from\' value > than \'to\' value', async () => {
    await userList.loginWithRub();
    const { data: { betsMap } } = await getMatchHistory({
      limit: [10, 0],
    });
    // console.log(betsMap);
    expect(betsMap).to.be.empty;
  });

  // TODO fix expect
  it('C27584 (-) 5 limits + 5 offset, where all filters, where service = null', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BETS:bets-history', {
      language: null,
      limit: [5, 5],
      order: ['id', 'DESC'],

      where: {
        status: [0, 1, 2, 3],
        service: null,
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  // TODO fix expect
  it('C27585 (+) 5 limits + 2 offset, where all filters, where service = null', async () => {
    await userList.loginWithRub();
    const { data } = await socket.send('BETS:bets-history', {
      language: null,
      limit: [2, 5],
      order: ['id', 'DESC'],

      where: {
        status: [0, 1, 2, 3],
        service: null,
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });
});
