import {userList} from '../../src/methods/userList';
import {generateCoupon, getTournamentMatches, makeBet, sportAll, sportTournaments} from '../../src/methods/better';

describe('Bets make', () => {
  // TODO вынести методы в глобальные переменные по созданию ставки
  // TODO после обновить старые тесты с маркером dev

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
   tournament-matches
   */

  it('re', async () => {
    const {data: {sportMap}} = await sportAll('prematch');
    const coupon = await generateCoupon(sportMap);
    const betReponse = await makeBet(coupon);
    console.log(betReponse);
  });

  it('re1', async () => {
    const {data: {sportTournamentMap}} = await sportTournaments('prematch', 1);
    console.log(sportTournamentMap);
    const coupon = await generateCoupon(sportTournamentMap);
    const betResponse = await makeBet(coupon);
    console.log(betResponse);
  });

  it('Prematch - ordinary bet', async () => {
    const { data: matches } = await getTournamentMatches({
      service: 'prematch',
      tournamentId: 12
    });

    const coupon = await generateCoupon(matches);

    console.log(coupon);

    const betResponse = await makeBet(coupon);

    console.log(betResponse);
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
    const {data: {topTournaments}} = await sportAll({
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
