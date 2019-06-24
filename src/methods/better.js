import Coupon from '../../test/test_bets/Coupon';

export async function getTournamentMatches(filters) {
    return await socket.send('MATCH-STORAGE-2:tournament-matches', {
        service: 'prematch',
        sportId: '1',
        timeFilter: {
            date: false,
            hour: false,
            ...filters
        }
    });
}

export function generateCoupon(matches) {
    const singleMatch = Object.values(matches.matchMap)[0];
    const odd = singleMatch.baseOddsConfig[0].cellList[0].odd;
    return new Coupon({...odd});
}
