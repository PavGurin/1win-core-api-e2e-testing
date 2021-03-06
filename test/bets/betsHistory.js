import { userList } from '../../src/methods/userList';
import { register } from '../../src/methods/register';
import { getMatchHistory } from '../../src/methods/matchStorage';

const ORDINARY = 'ordinary';
const EXPRESS = 'express';

describe('Bets history', () => {
  it('C27571 (+) user w/o bet history default filter', async () => {
    await register.oneClickReg();
    const { data } = await getMatchHistory();
    // console.log(data);
    expect(data.totalCount).toEqual(0);
    expect(data.betsMap).toEqual({});
  });

  it('C27572 (-) no order value', async () => {
    await register.oneClickReg();
    const { data } = await getMatchHistory({
      order: null,
    });
    // console.log(data);
    expect(data.status).toEqual(400);
    expect(data.message).toEqual('Bad request, order is required, no default value provided');
  });

  it('C27573 (-) no limit value', async () => {
    await register.oneClickReg();
    const { data } = await getMatchHistory({
      limit: null,
    });
    // console.log(data);
    expect(data.status).toEqual(400);
    expect(data.message).toEqual('Bad request, limit[1] is required, no default value provided');
  });

  it('C27574 (+) user w/o bet history asc order', async () => {
    await register.oneClickReg();
    const { data } = await getMatchHistory({
      order: ['id', 'ASC'],
    });
    // console.log(data);
    expect(data.totalCount).toEqual(0);
    expect(data.betsMap).toEqual({});
  });

  it('C27575 (+) user w/o bet history, bet type \'express\'', async () => {
    await register.oneClickReg();
    const { data } = await getMatchHistory({
      betType: EXPRESS,
    });
    // console.log(data);
    expect(data.totalCount).toEqual(0);
    expect(data.betsMap).toEqual({});
  });

  it('C27576 (+) user w/o bet history, bet type \'ordinary\'', async () => {
    const { data: regReq } = await register.oneClickReg();
    const { data } = await getMatchHistory({
      betType: ORDINARY,
    });
    // console.log(data);
    expect(data.totalCount).toEqual(0);
    expect(data.betsMap).toEqual({});
  });

  it('C27577 (+) user with bet history, bet type \'ordinary\'', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await getMatchHistory({
      betType: ORDINARY,
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === 'ordinary')).toEqual(true);
  });

  /** Bets statuses:
   status 0 - opened, 1 - lost, 2 - returned, 3 - won
   * */

  it('C27578 (+) all filters with all available values', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await getMatchHistory({
      order: ['id', 'DESC'],
      // ???????????? ?????????????????? ?????????????? ?? ?????????? 'where'
      where: {
        status: [0, 1, 2, 3, 4],
        service: ['prematch'],
        betType: ['ordinary', 'express'],
        dateFrom: 0,
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).toEqual(20);
  });

  it('C27579 (+) only \'lost\' bets status (status = 1)', async () => {
    await userList.loginWithRealMoney();
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory({
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [1],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).toEqual(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 1)).toEqual(true);
  });

  it('C27580 (+) only \'returned\' bets status (status = 2)', async () => {
    await userList.loginWithRealMoney();
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory({
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [2],
        // service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).toEqual(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 2)).toEqual(true);
  });

  it('C27581 (+) only \'won\' bets status (status = 3)', async () => {
    await userList.loginWithRealMoney();
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory({
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [3],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).toEqual(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 3)).toEqual(true);
  });

  it('C1650681 (+) only \'sale\' bets status (status = 4)', async () => {
    await userList.loginWithRealMoney();
    const expectedAmount = 5;
    const { data: { betsMap } } = await getMatchHistory({
      limit: expectedAmount,
      order: ['id', 'DESC'],

      where: {
        status: [4],
        service: ['live', 'prematch'],
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(betsMap);
    expect(Object.entries(betsMap).length).toEqual(expectedAmount);
    expect(Object.values(betsMap).every(({ status }) => status === 4)).toEqual(true);
  });

  it('C27582 (-) [0,0] limit', async () => {
    await userList.loginWithRub();
    const { data: { betsMap } } = await getMatchHistory({
      limit: 0,
    });
    // console.log(betsMap);
    expect(betsMap).toEqual({});
  });

  it('C27583 (-) limits \'from\' value > than \'to\' value', async () => {
    await userList.loginWithRub();
    const { data: { betsMap } } = await getMatchHistory({
      limit: [10, 0],
    });
    // console.log(betsMap);
    expect(betsMap).toEqual({});
  });

  it('C27584 (-) 5 limits, where all filters, where service = null', async () => {
    await userList.loginWithRealMoney();
    const { data } = await getMatchHistory({
      limit: [5, 5],
      order: ['id', 'DESC'],

      where: {
        status: [0, 1, 2, 3, 4],
        service: null,
        betType: ['ordinary', 'express'],
      },
    });
    // console.log(data);
    expect(Object.values(data.betsMap).length).toEqual(5);
  });
});
