import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { betsCustom } from '../../src/methods/betsCustom';
import { betsCustomFixtures } from '../../src/methods/betsCustomFixtures';
import { checkSuccessfulBet } from '../../src/expects/exCustomBets';

describe('Make custom bet', () => {
  let group;
  let event;
  let results;

  beforeAll(async () => {
    /* eslint prefer-destructuring: off */
    const { group: group1, event: event1, results: results1 } = await betsCustomFixtures
      .createGroupWithEventWithResults(2);
    // console.log(group);
    group = group1;
    event = event1;
    results = results1;
  });

  afterAll(async () => {
    await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
  });

  it.skip('bet harcode', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.setBalance(user.id, 500);
    // const coupon = new Coupon()
    const { data } = await socket.send('BETS:bets-make', {
      betsMap: {
        'prematch_1905415208_10_0_1_*': {
          amount: 133,
          couponList: [{
            id: 1,
            // coefficient: '1.20',
            // outcome: '1',
            service: 'prematch',
            matchId: 1,
            providerId: 3,
          }],
        },
      },
    });
    console.log(data);
    expect(data.status).toEqual(200);
    expect(data['prematch_1905415208_10_0_1_*'].status).toEqual(200);
    expect(data['prematch_1905415208_10_0_1_*'].error).toEqual(false);
  });

  it.skip('Test1', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.setBalance(user.id, 500);
    // const coupon = new Coupon()
    const { data } = await socket.send('BETS:bets-make', {
      betsMap: {
        someString: {
          amount: 227,
          couponList: [
            {
              typeId: 10,
              subTypeId: 0,
              outCome: '1',
              specialValue: '*',
              service: 'prematch',
              matchId: 6,
              id: 6,
              coefficient: 10,
              providerId: 3,
            },
          ],
        },
      },
    });
    console.log(data);
  });

  it.skip('Test2', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.setBalance(user.id, 500);
    // const coupon = new Coupon()
    const { data } = await betsCustom.makeBetShort(6, 100);
    console.log(data);
  });

  describe('Ordinary bet', () => {
    it('C2059829 (+) RUB', async () => {
      const amount = 155;
      const { data: user } = await register.oneClickReg();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059830 (+) USD', async () => {
      const amount = 17;
      const { data: user } = await register.oneClickRegUSD();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059831 (+) EUR', async () => {
      const amount = 13;
      const { data: user } = await register.oneClickRegEUR();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059832 (+) UAH', async () => {
      const amount = 59;
      const { data: user } = await register.oneClickRegUAH();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });
  });

  describe('Express bet', () => {
    let event2;
    let results2;

    beforeAll(async () => {
      event2 = await betsCustomFixtures.addEvent(group.id);
      results2 = [await betsCustomFixtures.addResult(event2.id),
        await betsCustomFixtures.addResult(event2.id)];
    });

    it('C2059833 (+) RUB', async () => {
      const amount = 171;
      const { data: user } = await register.oneClickReg();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeExpressBet(
        [{ id: results[0].id, coeff: results[0].factor },
          { id: results2[0].id, coeff: results2[0].factor }], amount,
      );
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059834 (+) USD', async () => {
      const amount = 19;
      const { data: user } = await register.oneClickRegUSD();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeExpressBet(
        [{ id: results[0].id, coeff: results[0].factor },
          { id: results2[0].id, coeff: results2[0].factor }], amount,
      );
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059835 (+) EUR', async () => {
      const amount = 19;
      const { data: user } = await register.oneClickRegEUR();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeExpressBet(
        [{ id: results[0].id, coeff: results[0].factor },
          { id: results2[0].id, coeff: results2[0].factor }], amount,
      );
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });

    it('C2059836 (+) UAH', async () => {
      const amount = 19;
      const { data: user } = await register.oneClickRegUAH();
      await banking.setBalance(user.id, amount);
      const { data } = await betsCustom.makeExpressBet(
        [{ id: results[0].id, coeff: results[0].factor },
          { id: results2[0].id, coeff: results2[0].factor }], amount,
      );
      // console.log(data);
      await checkSuccessfulBet(data, 0);
    });
  });
});
