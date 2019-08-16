import { expect } from 'chai';
import { register } from '../../src/methods/register';
import { logOut, setUserFullBlock } from '../../src/methods/user';
import { userList } from '../../src/methods/userList';
import { sleep } from '../../src/methods/utils';
import { banking } from '../../src/methods/banking';
import { cases } from '../../src/methods/cases';
import { getSingleMatch } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon, makeOrdinaryBet } from '../../src/methods/better';

describe('Full block tests', () => {
  describe('no full block', () => {
    it('C28640 (+) full_block = false by default', async () => {
      await register.oneClickReg();
      const meta = await socket.userMeta;
      // console.log(meta);
      expect(meta.full_block.initial).equal(false);
    });
  });

  describe('login with full_block', () => {
    it('C28641 (+) full_block = true in bd, login blocked', async () => {
      const { data } = await register.oneClickReg();
      await logOut();
      await setUserFullBlock(data.id);

      const { data: login } = userList.loginWithParams(data.email, data.password);
      await sleep(2000);
      expect(login).undefined;
    });
  });
  describe('banking, bets, cases with full block', () => {
    let user = {};
    let singleMatch = {};
    let coupon = {};

    beforeAll(async () => {
      await logOut();
      user = await register.usualReg();
      [singleMatch] = await getSingleMatch('prematch');
      coupon = await generateOrdinaryCoupon(singleMatch, 'RUB', 10);
      await banking.setBalance(user.data.id);
      await setUserFullBlock(user.data.id);
    });

    it('C28642 (+) full_block = true in bd after login, deposit blocked', async () => {
      const { data: deposit } = banking.depositCreateRequestRub(100, '1234567812345678', 'card_rub', 'RUB');
      await sleep(2000);
      expect(deposit).undefined;
    });

    it('C28645 (+) full_block = true in bd after login, transfer blocked', async () => {
      const { data } = banking.transferCreate(20, 'RUB');
      await sleep(2000);
      expect(data).undefined;
    });

    it('C28646 (+) full_block = true in bd after login, withdrawal blocked', async () => {
      const { data } = banking.withdrawalCreate(100, '1234567812345678', 'card_rub', 'RUB');
      await sleep(2000);
      expect(data).undefined;
    });

    it('C28643 (+) full_block = true in bd after login, cases blocked', async () => {
      const { data } = cases.playCase(1);
      await sleep(2000);
      expect(data).undefined;
    });

    it('C28644 (+) full_block = true in bd after login, bets blocked', async () => {
      const { data } = makeOrdinaryBet(coupon, 'RUB', 10);
      await sleep(2000);
      expect(data).undefined;
    });
  });
});