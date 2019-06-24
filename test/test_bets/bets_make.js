import {expect} from 'chai';
import {userList} from '../../src/methods/userList';
import {generateCoupon, getTournamentMatches} from '../../src/methods/better';

describe('Bets check', () => {

    //TODO вынести методы в глобальные переменные по созданию ставки
    //TODO после обновить старые тесты с маркером dev

    it('Bets make ver1', async () => {
        await userList.login_with_real_money();
        /**
         get available matches
         service 'live/prematch'
         sportId => (football = 1)
         */

        const {data: matches} = await getTournamentMatches({
            service: 'prematch',
            sportId: '1'
        });

        const coupon = generateCoupon(matches);

        // const singleMatch = Object.values(matches.matchMap)[0];
        // const odd = singleMatch.baseOddsConfig[0].cellList[0].odd;
        // // const coupon = new Coupon({...odd});

        console.log('xx');
        // console.log(match);
        // console.log(odd);
        console.log(coupon);

        const response = await socket.send('BETS:bets-make',
            {
                currency: 'RUB',
                betsMap: {
                    [coupon.couponId]: {
                        amount: 1,
                        couponList: [
                            {
                                service: coupon.service,
                                matchId: coupon.matchId,
                                typeId: coupon.typeId,
                                subTypeId: coupon.subTypeId,
                                outCome: coupon.outCome,
                                specialValue: coupon.specialValue,
                                coefficient: Object.values(matches.matchMap)[0].baseOddsConfig[0].cellList[0].odd.coefficient
                            }
                        ]
                    }
                }
            }
        );
        console.log(response);
    });

    it.skip('Bets make ordinar with money', async () => {
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
