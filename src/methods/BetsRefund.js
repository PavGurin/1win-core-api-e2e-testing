import { getSingleMatch, sportTournaments, tournamentMatches } from './matchStorage';
import {
  generateExpressCoupon,
  generateOrdinaryCoupon,
  makeExpressBet,
  makeOrdinaryBet,
} from './better';
import { sleep } from './utils';


const PREMATCH = 'prematch';
export const Refund = {

  async betsRefund(betIds, priceBets) {
    return socket.send('BETS:bets-refund', {
      betId: betIds,
      price: priceBets,
    });
  },
  async betsHistoryWithRefund() {
    return socket.send('BETS:bets-history', {
      withRefundData: true,
      order: ['id', 'DESC'],
      limit: [0, 1],
    });
  },
  async SellBetOrdinar(betAmount) {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);
    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    const betResponse = await makeOrdinaryBet(coupon, betAmount);
    // console.log(betResponse);
    const { data: { betsMap } } = await Refund.betsHistoryWithRefund();
    const betid = (Object.keys(betsMap))[0];
    // console.log(betid);
    const { price } = (Object.values(betsMap)[0]).refundInfo;
    // console.log(price);
    const { data } = await Refund.betsRefund(betid, price);
    expect(data.success).toEqual(true);
    await sleep(1000);
    return price;
  },
  async SellBetExpress(betAmount) {
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);
    const coupon = generateExpressCoupon(matchMap, 2, betAmount);
    // console.log(coupon);
    const betResponse = await makeExpressBet(Object.values(coupon));
    const { data: { betsMap } } = await Refund.betsHistoryWithRefund();
    const betid = (Object.keys(betsMap))[0];
    // console.log(betid);
    const { price } = (Object.values(betsMap)[0]).refundInfo;
    // console.log(price);
    const { data } = await Refund.betsRefund(betid, price);
    expect(data.success).toEqual(true);
    return price;
  },
};
