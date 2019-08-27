import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { getMatchHistory } from '../../src/methods/matchStorage';

const ORDINARY = 'ordinary';

describe('Get methods map', () => {
  it('C27577 (+) user with bet history, bet type \'ordinary\'', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await getMatchHistory({
      betType: ORDINARY,
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === ORDINARY)).equal(true);
  });
});
