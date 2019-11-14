import { userList } from '../../src/methods/userList';
import { getSingleMatch, sportAll } from '../../src/methods/matchStorage';
import { generateOrdinaryCoupon } from '../../src/methods/better';

describe('Bets make', () => {
  const PREMATCH = 'prematch';
  const LIVE = 'live';

  beforeEach(async () => {
    await userList.loginWithRealMoney(socket);
  });

  //+
  it('oddRender prematch', async () => {
    const singleMatch = await getSingleMatch(PREMATCH);
    // console.log(singleMatch);
    const { matchId } = singleMatch;
    const { data } = await socket.send('MATCH-STORAGE-2:match-odds',
      {
        service: PREMATCH,
        matchId,
        lang: 'ru',
      });
    for (let i = 0; i < Object.values(data.oddsTypeMap).length; i++) {
      expect(Object.values(data.oddsTypeMap)[i].render.renderKey).toEqual('outComeDescription');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderKey);
      expect(Object.values(data.oddsTypeMap)[i].render.renderType).toEqual('table');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderType);
      expect(Object.values(data.oddsTypeMap)[i].render.renderValue).toEqual('specialValueDescription');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderValue);
    }
    // console.log(data);
  });

  it('oddRender live', async () => {
    const singleMatch = await getSingleMatch(LIVE);
    // console.log(singleMatch);
    const { matchId } = singleMatch;
    const { data } = await socket.send('MATCH-STORAGE-2:match-odds',
      {
        service: LIVE,
        matchId,
        lang: 'ru',
      });
    for (let i = 0; i < Object.values(data.oddsTypeMap).length; i++) {
      expect(Object.values(data.oddsTypeMap)[i].render.renderKey).toEqual('outComeDescription');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderKey);
      expect(Object.values(data.oddsTypeMap)[i].render.renderType).toEqual('table');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderType);
      expect(Object.values(data.oddsTypeMap)[i].render.renderValue).toEqual('specialValueDescription');
      // console.log(Object.values(data.oddsTypeMap)[i].render.renderValue);
    }
    // console.log(data);
  });
});
