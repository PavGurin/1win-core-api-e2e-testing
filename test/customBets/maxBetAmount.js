import { register } from '../../src/methods/register';
import { banking } from '../../src/methods/banking';
import { betsCustom } from '../../src/methods/betsCustom';
import { checkMaxBetAmount } from '../../src/expects/exCustomBets';
import { betsCustomFixtures } from '../../src/methods/betsCustomFixtures';

describe('MaxBetAmount for custom bets', () => {
  let group;
  let event;
  let results;

  beforeAll(async () => {
    /* eslint prefer-destructuring: off */
    const { group: group1, event: event1, results: results1 } = await betsCustomFixtures
      .createGroupWithEventWithResults(2);
    group = group1;
    event = event1;
    results = results1;
  });

  afterAll(async () => {
    await betsCustomFixtures.setGroupIsDisabled(group.id, 1);
  });


  it('C2035484 (+) bet RUB', async () => {
    const amount = 1000;
    const { data: user } = await register.oneClickReg();
    // console.log(user.id);
    await banking.setBalance(user.id, amount);
    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountBefore);
    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);
    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountAfter);
    await checkMaxBetAmount(maxBetAmountBefore, maxBetAmountAfter, amount, 'RUB');
  });

  it('C2035485 (+) bet USD', async () => {
    const amount = 10;
    const { data: user } = await register.oneClickRegUSD();
    await banking.setBalance(user.id, amount);
    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountBefore);
    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);
    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountAfter);
    await checkMaxBetAmount(maxBetAmountBefore, maxBetAmountAfter, amount, 'USD');
  });

  it('C2035486 (+) bet EUR', async () => {
    const amount = 10;
    const { data: user } = await register.oneClickRegEUR();
    await banking.setBalance(user.id, amount);
    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountBefore);
    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);
    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountAfter);
    await checkMaxBetAmount(maxBetAmountBefore, maxBetAmountAfter, amount, 'EUR');
  });

  it('C2035487 (+) bet UAH', async () => {
    const amount = 50;
    const { data: user } = await register.oneClickRegUAH();
    await banking.setBalance(user.id, amount);
    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountBefore);
    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);
    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountAfter);
    await checkMaxBetAmount(maxBetAmountBefore, maxBetAmountAfter, amount, 'UAH');
  });


  it('C2035488 (+) maxbetamount of other result in the same event is different', async () => {
    const { data: { maxBetAmount: maxBetAmount1 } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmount1);
    const { data: { maxBetAmount: maxBetAmount2 } } = await betsCustom
      .maxBetAmount(results[1].id, results[1].factor);
      // console.log(maxBetAmount2);

    Object.keys(maxBetAmount1).forEach((key) => {
      expect(maxBetAmount1[key]).not.toEqual(maxBetAmount2[key]);
    });
  });

  it('C2035489 (+) maxbetamount of other result in the same event is changed after bet', async () => {
    const amount = 1000;
    const { data: user } = await register.oneClickReg();
    // console.log(user.id);
    await banking.setBalance(user.id, amount);
    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results[1].id, results[1].factor);
    // console.log(maxBetAmountBefore);
    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);
    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results[1].id, results[1].factor);
    // console.log(maxBetAmountAfter);
    Object.keys(maxBetAmountAfter).forEach((key) => {
      expect(maxBetAmountAfter[key]).not.toEqual(maxBetAmountBefore[key]);
    });
  });

  it('C2035490 (+) maxbetamount of result in other event is different and not changed after bet ', async () => {
    const event2 = await betsCustomFixtures.addEvent(group.id);
    const results2 = [await betsCustomFixtures.addResult(event2.id),
      await betsCustomFixtures.addResult(event2.id)];
    const amount = 1000;
    const { data: user } = await register.oneClickReg();
    // console.log(user.id);
    await banking.setBalance(user.id, amount);

    const { data: { maxBetAmount: maxBetAmountBefore } } = await betsCustom
      .maxBetAmount(results2[0].id, results2[0].factor);
      // console.log(maxBetAmountBefore);

    const { data: { maxBetAmount: maxBetAmountBeforeBetResult } } = await betsCustom
      .maxBetAmount(results[0].id, results[0].factor);
      // console.log(maxBetAmountBeforeBetResult);

    Object.keys(maxBetAmountBefore).forEach((key) => {
      expect(maxBetAmountBefore[key]).not.toEqual(maxBetAmountBeforeBetResult[key]);
    });

    const { data: bet } = await betsCustom
      .makeOrdinaryBet(results[0].id, amount, results[0].factor);
      // console.log(bet);

    const { data: { maxBetAmount: maxBetAmountAfter } } = await betsCustom
      .maxBetAmount(results2[0].id, results2[0].factor);
      // console.log(maxBetAmountAfter);

    expect(maxBetAmountAfter).toEqual(maxBetAmountBefore);
  });
});
