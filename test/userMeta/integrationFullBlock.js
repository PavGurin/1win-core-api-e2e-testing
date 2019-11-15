import { register } from '../../src/methods/register';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, makeOrdinaryBet } from '../../src/methods/better';
import { banking } from '../../src/methods/banking';
import { setUserFullBlock } from '../../src/methods/user';
import { sleep } from '../../src/methods/utils';
import { cases } from '../../src/methods/cases';

describe('banking, bets, cases with full block', () => {
  let user = {};
  let singleMatch = {};
  let coupon = {};

  beforeEach(async () => {
    user = await register.usualReg();
    singleMatch = await getSingleMatch('prematch');
    coupon = await generateOrdinaryCoupon(singleMatch, 'RUB', 10);
    await banking.setBalance(user.data.id);
    await setUserFullBlock(user.data.id);
  });

  it('C28642 (+) full_block = true in bd after login, deposit blocked', async () => {
    const { data: deposit } = banking.depositCreateRequest('1234567812345678', 'card_rub', 'RUB', 100);
    await sleep(2000);
    expect(deposit).toBeUndefined();
  });

  it('C28645 (+) full_block = true in bd after login, transfer blocked', async () => {
    const { data } = banking.transferCreate(20, 'RUB');
    await sleep(2000);
    expect(data).toBeUndefined();
  });

  it('C28646 (+) full_block = true in bd after login, withdrawal blocked', async () => {
    const { data } = banking.withdrawalCreate('1234567812345678', 'card_rub', 'RUB', 100);
    await sleep(2000);
    expect(data).toBeUndefined();
  });

  it('C28643 (+) full_block = true in bd after login, cases blocked', async () => {
    const { data } = cases.playCaseWithoutChance(1);
    await sleep(2000);
    expect(data).toBeUndefined();
  });

  it('C28644 (+) full_block = true in bd after login, bets blocked', async () => {
    const { data } = makeOrdinaryBet(coupon, 'RUB', 10);
    await sleep(2000);
    expect(data).toBeUndefined();
  });
});
