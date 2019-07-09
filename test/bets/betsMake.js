import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateCoupon, generateCouponSingle, getMaxBetAmount, makeBet, sportAll, sportCategories, sportTournaments,
  tournamentMatches,
} from '../../src/methods/better';

describe('Bets make', () => {
  // TODO после обновить старые тесты с маркером dev

  const currency = 'RUB';
  const PREMATCH = 'prematch';
  const live = 'live';

  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });


  /**
   get available matches
   service 'live/prematch'
   sportId => (football = 1)

   sport-all
   sport-categories
   sport-tournaments

   tournaments-hot**
   tournament-matches**
   */


  //+
  it('sportAll', async () => {
    // serviceType live/prematch
    const { data: { sportMap } } = await sportAll('prematch');
    // console.log(sportMap);

    Object.values(sportMap).forEach((value) => {
      expect(value.sportId).not.equal(null);
      expect(value.matchCount).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    });
  });

  //+
  it('sportCategories', async () => {
    const { data: { sportMap: sportAllResponse } } = await sportAll(PREMATCH);
    // console.log(sportAllResponse);
    const { sportId } = Object.values(sportAllResponse)[0];
    // console.log(sportId);

    const { data: { sportCategoriesMap } } = await sportCategories(PREMATCH, sportId);
    // console.log(sportCategoriesMap);
    Object.values(sportCategoriesMap).forEach(((value) => {
      expect(value.categoryId).not.equal(null);
      expect(value.categoryName.en).not.equal(null);
      expect(value.categoryName.ru).not.equal(null);
      expect(value.sportId).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    }));
  });

  //+
  it('Ordinary bet', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId);
    // console.log(matchMap);

    const singleMatch = Object.values(matchMap)[0];
    // console.log(singleMatch);

    const coupon = await generateCouponSingle(singleMatch);
    // console.log(coupon);

    const betResponse = await makeBet(coupon, currency, 1);
    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('Prematch - ordinary bet', async () => {
    const { data: matches } = await sportTournaments({
      service: 'prematch',
      tournamentId: 12,
    });

    const coupon = await generateCoupon(matches);

    // console.log(coupon);

    const betResponse = await makeBet(coupon, currency, 1);

    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('MaxBetAmount', async () => {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId);
      // console.log(matchMap);

    const singleMatch = Object.values(matchMap)[0];
    // console.log(singleMatch);

    const coupon = await generateCouponSingle(singleMatch);
    // console.log(coupon);

    const xxx = getMaxBetAmount(coupon, singleMatch);
    const { data } = await getMaxBetAmount(coupon, singleMatch);

    console.log(data);
  });

  // it('Prematch - express bet', async () => {
  //   /**
  //        get available matches
  //        service 'live/prematch'
  //        sportId => (football = 1)
  //        */
  //
  //   const { data: matches } = await getTournamentMatches({
  //     service: 'prematch',
  //     // sportId: '1'
  //   });
  //
  //   const coupon = await generateCoupon(matches);
  //
  //   const betResponse = await makeBet(coupon);
  //
  //   // console.log(betResponse);
  // });
  //
  // it.skip('Bets make ordinary with money', async () => {
  //   await userList.login_with_RUB();
  //   const { betData } = await socket.send('BETS:bets-make',
  //     {
  //       currency: 'RUB',
  //       betsMap: {
  //         'prematch_16493397_386_0_Draw / No_*': {
  //           amount: 13,
  //           couponList: [
  //             {
  //               service: 'prematch',
  //               matchId: 16493397,
  //               typeId: 386,
  //               subTypeId: 0,
  //               outCome: 'Draw / No',
  //               specialValue: '*',
  //               coefficient: '7.98',
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   // console.log(betData);
  //
  //   expect(betData).to.deep.include({ status: 403 });
  //   expect(betData).to.deep.include({ message: 'Недостаточно средств' });
  // });
});
