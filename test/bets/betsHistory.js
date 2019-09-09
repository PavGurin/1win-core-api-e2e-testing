import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';
import { getMatchHistory } from '../../src/methods/matchStorage';

const ORDINARY = 'ordinary';
const EXPRESS = 'express';

describe('Bets history', () => {
  it('C27571 (+) user w/o bet history default filter', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket);
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27572 (-) no order value', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket, {
      order: null,
    });
    // console.log(data);
    expect(data.status).equal(400);
    expect(data.message).equal('Bad request, order is required, no default value provided');
  });

  it('C27573 (-) no limit value', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket, {
      limit: null,
    });
    // console.log(data);
    expect(data.status).equal(400);
    expect(data.message).equal('Bad request, limit[1] is required, no default value provided');
  });

  it('C27574 (+) user w/o bet history asc order', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket, {
      order: ['id', 'ASC'],
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27575 (+) user w/o bet history, bet type \'express\'', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket, {
      betType: EXPRESS,
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27576 (+) user w/o bet history, bet type \'ordinary\'', async () => {
    const { data: regReq } = await register.oneClickReg(socket);
    const { data } = await getMatchHistory(socket, {
      betType: ORDINARY,
    });
    // console.log(data);
    expect(data.totalCount).equal(0);
    expect(data.betsMap).to.be.empty;
  });

  it('C27577 (+) user with bet history, bet type \'ordinary\'', async () => {
    await userList.loginWithRealMoney(socket);
    const { data: { betsMap } } = await getMatchHistory(socket, {
      betType: ORDINARY,
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === 'ordinary')).equal(true);
  });

  /** Bets statuses:
   status 0 - opened, 1 - lost, 2 - returned, 3 - won
   * */

  it('C27578 (+) all filters with all available values', async () => {
    await userList.loginWithRealMoney(socket);
    const { data: { betsMap } } = await getMatchHistory(socket, {
      order: ['id', 'DESC'],
      // полные настройки фильтра в блоке 'where'
      where: {
        status: [0, 1, 2, 3],
        service: ['prematch'],
        betType: ['ordinary', 'express'],
        dateFrom: 0,
      },
    });


    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(20);
  });

  it('C27579 (+) only \'lost\' bets status (status = 1)', async () => {
    await userList.loginWithRealMoney(socket);
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory(socket, {
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [0],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 0)).equal(true);
  });

  it('C27580 (+) only \'returned\' bets status (status = 2)', async () => {
    await userList.loginWithRealMoney(socket);
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory(socket, {
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [2],
        // service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 2)).equal(true);
  });

  it('C27581 (+) only \'won\' bets status (status = 3)', async () => {
    await userList.loginWithRealMoney(socket);
    const expectedAmount = 15;
    const { data: { betsMap } } = await getMatchHistory(socket, {
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [1],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).equal(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 1)).equal(true);
  });

  it('C27582 (-) [0,0] limit', async () => {
    await userList.loginWithRub(socket);
    const { data: { betsMap } } = await getMatchHistory(socket, {
      limit: 0,
    });
    // console.log(betsMap);
    expect(betsMap).to.be.empty;
  });

  it('C27583 (-) limits \'from\' value > than \'to\' value', async () => {
    await userList.loginWithRub(socket);
    const { data: { betsMap } } = await getMatchHistory(socket, {
      limit: [10, 0],
    });
    // console.log(betsMap);
    expect(betsMap).to.be.empty;
  });

  it('C27584 (-) 5 limits, where all filters, where service = null', async () => {
    await userList.loginWithRealMoney(socket);
    const { data } = await getMatchHistory(socket, {
      limit: [5, 5],
      order: ['id', 'DESC'],

      where: {
        status: [0, 1, 2, 3],
        service: null,
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(data);
    expect(Object.values(data.betsMap).length).equal(5);
  });
});
