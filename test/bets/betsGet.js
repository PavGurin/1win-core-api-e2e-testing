import { userList } from '../../src/methods/userList';
import { checkError404, checkErrorMsg } from '../../src/responseChecker';
import { register } from '../../src/methods/register';
import {
  generateExpressCoupon, generateOrdinaryCoupon, makeExpressBet, makeOrdinaryBet,
} from '../../src/methods/better';
import {
  getMatchById,
  getMatchHistory,
  getSingleMatch,
  sportTournaments,
  tournamentMatches,
} from '../../src/methods/matchStorage';

const PREMATCH = 'prematch';
const ORDINARY = 'ordinary';
const EXPRESS = 'express';

describe('Bets get', () => {
  it('C22020 (-) user without bet history', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchById(25);
    // console.log(data);
    checkError404(data, 'Ставка не найдена');
  });

  it('C22021 (-) without ID field', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchById();
    // console.log(data);
    checkErrorMsg(data, 'Bad request, id is required');
  });

  it('C22022 (-) empty ID field', async () => {
    await register.oneClickReg(socket);
    const { data } = await getMatchById('');
    // console.log(data);
    checkError404(data, 'Ставка не найдена');
  });

  it('C22023 (-) non authorized user get bet', async () => {
    const { data } = await getMatchById(25);
    // console.log(data);
    checkError404(data, 'Ставка не найдена');
  });

  it('C22024 (+) get ordinary bet by id', async () => {
    const { data: login } = await userList.loginWithRealMoney(socket);
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);
    const coupon = await generateOrdinaryCoupon(singleMatch, 1);
    // console.log(coupon);
    await makeOrdinaryBet(socket, coupon, 10);

    const { data: betsMap } = await getMatchHistory(socket, {
      betType: ORDINARY,
      limit: 1,
    });
    // console.log(betsMap);
    const { data: getBet } = await getMatchById(Object.values(betsMap.betsMap)[0].id);
    // console.log(getBet);
    expect(login.id).toEqual(getBet.id_user);
    expect(getBet.betType).toEqual('ordinary');
    expect(getBet.currency).toEqual('RUB');
    expect(getBet.id).toEqual(Object.values(betsMap.betsMap)[0].id);
    for (let i = 0; i < getBet.selectionList.length; i++) {
      expect(getBet.selectionList[i].bet_id).toEqual(Object.values(betsMap.betsMap)[0].id);
    }
  });

  it('C22025 (+) get express bet by id', async () => {
    const { data: login } = await userList.loginWithRealMoney(socket);
    const { data: { sportTournamentMap } } = await sportTournaments(PREMATCH, 'all');
    // console.log(sportTournamentMap);

    const { data: { matchMap } } = await tournamentMatches(
      PREMATCH,
      Object.values(Object.values(sportTournamentMap)[0])[0].tournamentId,
    );
    // console.log(matchMap);
    const coupon = generateExpressCoupon(matchMap, 2, 10);
    // console.log(coupon);
    await makeExpressBet(Object.values(coupon));
    // console.log(betResponse);
    const { data: betsMap } = await getMatchHistory(socket, {
      betType: EXPRESS,
      limit: 1,
    });
    // console.log(betsMap);
    const { data: getBet } = await getMatchById(Object.values(betsMap.betsMap)[0].id);
    // console.log(getBet);
    expect(login.id).toEqual(getBet.id_user);
    expect(getBet.betType).toEqual('express');
    expect(getBet.currency).toEqual('RUB');
    expect(getBet.id).toEqual(getBet.id);
    expect(getBet.selectionList.length).toEqual(2);
    // проверяет 'bet_id' каждой ставки экспресса (должно совпадать
    for (let i = 0; i < getBet.selectionList.length; i++) {
      expect(getBet.selectionList[i].bet_id).toEqual(getBet.id);
    }
  });
});
