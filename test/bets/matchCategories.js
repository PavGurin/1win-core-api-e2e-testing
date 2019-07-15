import { expect } from 'chai';
import { userList } from '../../src/methods/userList';
import { sportAll, sportCategories } from '../../src/methods/matchStorage';

describe('Bets make', () => {
  const PREMATCH = 'prematch';
  const LIVE = 'live';

  beforeEach(async () => {
    await userList.loginWithRealMoney();
  });


  //+
  it('sportAll prematch', async () => {
    // serviceType live/prematch
    const { data: { sportMap } } = await sportAll(PREMATCH);
    // console.log(sportMap);

    Object.values(sportMap).forEach((value) => {
      expect(value.sportId).not.equal(null);
      expect(value.matchCount).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    });
  });

  it('sportAll live', async () => {
    // serviceType live/prematch
    const { data: { sportMap } } = await sportAll(LIVE);
    // console.log(sportMap);

    Object.values(sportMap).forEach((value) => {
      expect(value.sportId).not.equal(null);
      expect(value.matchCount).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    });
  });

  //+
  it('sportCategories prematch', async () => {
    const { data: { sportMap: sportAllResponse } } = await sportAll(PREMATCH);
    // console.log(sportAllResponse);
    const { sportId } = Object.values(sportAllResponse)[0];
    // console.log(sportId);

    const { data: { sportCategoriesMap } } = await sportCategories(PREMATCH, sportId);
    // console.log(sportCategoriesMap);
    Object.values(sportCategoriesMap).forEach(((value) => {
      expect(value.categoryId).not.equal(null);
      expect(value.categoryName.en).not.equal(null);
      expect(value.categoryName.ru).not.equal(null);
      expect(value.sportId).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    }));
  });

  it('sportCategories live', async () => {
    const { data: { sportMap: sportAllResponse } } = await sportAll(LIVE);
    // console.log(sportAllResponse);
    const { sportId } = Object.values(sportAllResponse)[0];
    // console.log(sportId);

    const { data: { sportCategoriesMap } } = await sportCategories(PREMATCH, sportId);
    // console.log(sportCategoriesMap);
    Object.values(sportCategoriesMap).forEach(((value) => {
      expect(value.categoryId).not.equal(null);
      expect(value.categoryName.en).not.equal(null);
      expect(value.categoryName.ru).not.equal(null);
      expect(value.sportId).not.equal(null);
      expect(value.sportName.en).not.equal(null);
      expect(value.sportName.ru).not.equal(null);
    }));
  });
});
