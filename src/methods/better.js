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
      hour: false,
    },
    tournamentId,
  });
}

export function generateCouponSingle(match) {
  return new Coupon(match.baseOddsConfig[0].cellList[0].odd);
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

export async function getMaxBetAmount(coupon, singleMatch) {
  const x = await socket.send('BETS:maxBetAmount',
    {
      couponList: [
        {
          coefficient: coupon.saveCoefficient,
          match: {
            categoryId: singleMatch.categoryId,
            matchId: coupon.matchId,
            sportId: singleMatch.sportId,
            tournamentId: singleMatch.tournamentId,
          },
          odd: {
            coefficient: toString(coupon.saveCoefficient),
            outCome: toString(coupon.outCome),
            service: coupon.service,
            specialValue: coupon.specialValue,
            subTypeId: coupon.subTypeId,
            typeId: coupon.typeId,
          },
        },
      ],
    });

  console.log(x);
}
