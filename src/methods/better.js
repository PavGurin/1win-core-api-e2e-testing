import Coupon from '../Coupon';

export function generateOrdinaryCoupon(match, currency, amount) {
  return new Coupon(match.baseOddsConfig[0].cellList[0].odd);
}

export function generateExpressCoupon(matchMap, count, amount) {
  const coupons = Object
    .values(matchMap)
    .slice(0, count)
    .map(it => generateOrdinaryCoupon(it));
  const couponIds = coupons.map(({ couponId }) => couponId).join('?');
  const couponList = coupons.map(coupon => ({
    service: coupon.service,
    matchId: coupon.matchId,
    typeId: coupon.typeId,
    subTypeId: coupon.subTypeId,
    outCome: coupon.outCome,
    specialValue: coupon.specialValue,
    coefficient: coupon.saveCoefficient,
  }));
  return {
    currency: 'RUB',
    betsMap: {
      [couponIds]: {
        amount,
        couponList,
      },
    },
  };
}

export async function makeExpressBet(coupon) {
  return socket.send('BETS:bets-make',
    {
      currency: coupon[0],
      betsMap: coupon[1],
    });
}

export async function makeOrdinaryBetOld(coupon, currency, amount) {
  return socket.send('POST:makeBet',
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

export async function makeOrdinaryBet(coupon, currency, amount) {
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
  return socket.send('BETS:bets-maxBetAmount',
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
            coefficient: Object.values(singleMatch.oddsTypeMap)[0].oddsMap[1].coefficient,
            outCome: Object.values(singleMatch.oddsTypeMap)[0].oddsMap[1].outCome,
            service: coupon.service,
            specialValue: coupon.specialValue,
            subTypeId: coupon.subTypeId,
            typeId: coupon.typeId,
          },
        },
      ],
    });
}

export async function getMaxBetAmountOld(coupon, singleMatch) {
  return socket.send('GET:maxBetAmount',
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
            coefficient: Object.values(singleMatch.oddsTypeMap)[0].oddsMap[1].coefficient,
            outCome: Object.values(singleMatch.oddsTypeMap)[0].oddsMap[1].outCome,
            service: coupon.service,
            specialValue: coupon.specialValue,
            subTypeId: coupon.subTypeId,
            typeId: coupon.typeId,
          },
        },
      ],
    });
}
