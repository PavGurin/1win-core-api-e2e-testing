import Coupon from './coupon';

export async function getTournamentMatches(filters) {
    return await socket.send('MATCH-STORAGE-2:tournament-matches', {
        service: 'prematch',
        // sportId: '12',
        timeFilter: {
            date: false,
            hour: false,
            ...filters
        }
    });
}

export function generateCoupon(matches) {
    // const singleMatch = Object.values(matches.matchMap)[0];
    // const odd = singleMatch.baseOddsConfig[0].cellList[0].odd;
    return new Coupon({...Object.values(matches.matchMap)[0].baseOddsConfig[0].cellList[0].odd});
}

export async function makeBet(coupon) {
    return await socket.send('BETS:bets-make',
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
                            coefficient: coupon.saveCoefficient
                        }
                    ]
                }
            }
        });
}
