import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {generateCoupon, getTournamentMatches, makeBet} from '../../src/methods/better';

describe('Bets make', () => {

  //TODO вынести методы в глобальные переменные по созданию ставки
  //TODO после обновить старые тесты с маркером dev

  beforeEach(async () => {
    await userList.login_with_real_money();
  });

  it('Prematch - ordinary bet', async () => {

    /**
     get available matches
     service 'live/prematch'
     sportId => (football = 1)
     */

    const {data: matches} = await getTournamentMatches({
      service: 'prematch'
      // sportId: '1'
    });

    const coupon = await generateCoupon(matches);

    const betResponse = await makeBet(coupon);

    // console.log(betResponse);
  });

  it('Prematch - express bet', async () => {

    /**
     get available matches
     service 'live/prematch'
     sportId => (football = 1)
     */

    const {data: matches} = await getTournamentMatches({
      service: 'prematch'
      // sportId: '1'
    });

    const coupon = await generateCoupon(matches);

    const betResponse = await makeBet(coupon);

    // console.log(betResponse);
  });

  it.skip('Bets make ordinary with money', async () => {
    await userList.login_with_RUB();
    const {betData} = await socket.send('BETS:bets-make',
        {
          'currency': 'RUB',
          'betsMap': {
            'prematch_16493397_386_0_Draw / No_*': {
              'amount': 13,
              'couponList': [
                {
                  'service': 'prematch',
                  'matchId': 16493397,
                  'typeId': 386,
                  'subTypeId': 0,
                  'outCome': 'Draw / No',
                  'specialValue': '*',
                  'coefficient': '7.98'
                }
              ]
            }
          }
        }
    );
    //console.log(betData);

    expect(betData).to.deep.include({status: 403});
    expect(betData).to.deep.include({message: 'Недостаточно средств'});
  });
});
