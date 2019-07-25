import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { getMatchHistory } from '../../src/methods/matchStorage';

describe('Get methods map', () => {
  it('C27577 (+) user with bet history, bet type \'ordinary\'', async () => {
    await userList.loginWithRealMoney();
    const { data: { betsMap } } = await getMatchHistory({
      where: {
        betType: ['ordinary'],
      },
    });
    // console.log(betsMap);
    expect(Object.values(betsMap).every(({ betType }) => betType === 'ordinary')).equal(true);
  });
});
