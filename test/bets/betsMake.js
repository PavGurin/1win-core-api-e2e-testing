import { expect } from 'chai';

import { userList } from '../../src/methods/userList';
import {
  generateCoupon, getTournamentMatches, makeBet, sportAll, sportCategories,
} from '../../src/methods/better';

describe('Bets make', () => {
  // TODO вынести методы в глобальные переменные по созданию ставки
  // TODO после обновить старые тесты с маркером dev

  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });

  const service = 'prematch';

  /**
   get available matches
   service 'live/prematch'
   sportId => (football = 1)


   sport-all
   sport-categories
   sport-tournaments
   tournament-matches
   */

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

  it('sportCategories', async () => {
    const { data: { sportMap: sportAllResponse } } = await sportAll(service);
    // console.log(sportAllResponse);
    const { sportId } = Object.values(sportAllResponse)[0];
    // console.log(sportId);

    const { data: { sportCategoriesMap } } = await sportCategories(service, sportId);
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


  it('Prematch - ordinary bet', async () => {
    const { data: matches } = await getTournamentMatches({
      service: 'prematch',
      tournamentId: 12,
    });

    const coupon = await generateCoupon(matches);

    // console.log(coupon);

    const betResponse = await makeBet(coupon);

    // console.log(betResponse);

    expect(betResponse.data[coupon.couponId].error).equal(false);
    expect(betResponse.status).equal(200);
  });

  it('spor1t ', async () => {
    const { data: { sportMap } } = await socket.send('MATCH-STORAGE-2:sport-all', {
      service: 'prematch',
      timeFilter: {
        date: false,
        hour: false,
      },
    });
    console.log(sportMap);
  });

  it('sport ', async () => {
    const { data: { topTournaments } } = await sportAll({
      sportId: 1,
    });
    console.log(topTournaments);
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
