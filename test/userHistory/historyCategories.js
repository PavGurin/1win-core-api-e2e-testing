import { register } from '../../src/methods/register';
import { history } from '../../src/methods/history';
import { banking } from '../../src/methods/banking';
import { cases } from '../../src/methods/cases';
import { addCasinoGamePlayedInBD } from '../../src/methods/casinoInBD';
import { addBetToBD } from '../../src/methods/betsInBD';

describe('History categories', () => {
  const TEN_ROUBLES_CASE_ID = 5;
  it('C1789741 (-) new user, no categories', async () => {
    await register.oneClickReg();
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });

  it('C1789742 (+) user with deposits', async () => {
    const { data: user } = await register.oneClickReg();
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      await banking.createDepositInBD(user.id, 'RUB', 100, new Date(), 'card_rub', '5520718827238343', 1, 'payterra');
    }
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });

  it('C1789743 (+) user with cases', async () => {
    const { data: user } = await register.oneClickReg();
    await banking.setBalance(user.id, 100);
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      await cases.playCaseWithoutChance(TEN_ROUBLES_CASE_ID);
    }
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });

  it('C1789744 (+) user with casino', async () => {
    const { data: user } = await register.oneClickReg();
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      await addCasinoGamePlayedInBD(user.id, i + 10, i + 5, 'RUB', new Date());
    }
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });

  it('C1789745 (+) user with bets', async () => {
    const { data: user } = await register.oneClickReg();
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      await addBetToBD(user.id, 'RUB', 100, 2, 1);
    }
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });

  it('C1789746 (+) user with withdrawals', async () => {
    const { data: user } = await register.oneClickReg();
    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line no-await-in-loop
      await banking.createWithdrawalInBD(user.id, 100, new Date(), 'card_rub', '5520718827238343', 1, 'payterra');
    }
    const { data } = await history.categories();
    // console.log(data);
    // expect(data).toStrictEqual({ categories: { deposits: true, casino: true, cases: true } });
    expect(data).toStrictEqual({ categories: { deposits: true, casino: false, cases: false } });
  });
});
