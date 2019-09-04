import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { getMatchHistory } from '../../src/methods/matchStorage';
import { getNewSocket } from '../global';

const ORDINARY = 'ordinary';
let socket;

describe('Get methods map', () => {
  beforeEach(async () => {
    socket = await getNewSocket();
  });

  afterEach(() => socket.disconnect());

  it('C558187 health checker (bet-history, type - ordinary)', async () => {
    await userList.loginWithRealMoney(socket);
    const { data: { betsMap } } = await getMatchHistory(socket, {
      betType: ORDINARY,
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === ORDINARY)).equal(true);
  });
});
