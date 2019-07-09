import Coupon from '../Coupon';

// USELESS for bets
export async function sportAll(service) {
  return socket.send('MATCH-STORAGE-2:sport-all', {
    service,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function sportCategories(service, sportId) {
  return socket.send('MATCH-STORAGE-2:sport-categories', {
    service,
    sportId,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function sportTournaments(service, tournamentId) {
  return socket.send('MATCH-STORAGE-2:sport-tournaments', {
    service,
    tournamentId,
    timeFilter: {
      date: false,
      hour: false,
    },
  });
}

export async function tournamentMatches(service, tournamentId) {
  return socket.send('MATCH-STORAGE-2:tournament-matches', {
    service,
    timeFilter: {
      date: false,
      hoursToStart: 1,
    },
    tournamentId,
  });
}

export function generateCoupon(matches) {
  // const singleMatch = Object.values(matches.matchMap)[0];
  // const odd = singleMatch.baseOddsConfig[0].cellList[0].odd;
  return new Coupon({ ...Object.values(matches.matchMap)[0].baseOddsConfig[0].cellList[0].odd });
}

export async function makeBet(coupon, currency, amount) {
  return socket.send('BETS:bets-make',
    {
      currency,
      betsMap: {
        [coupon.couponId]: {
          amount,
          couponList: [
            {
              service: coupon.service,
              matchId: coupon.matchId,
              typeId: coupon.typeId,
              subTypeId: coupon.subTypeId,
              outCome: coupon.outCome,
              specialValue: coupon.specialValue,
              coefficient: coupon.saveCoefficient,
            },
          ],
        },
      },
    });
}
