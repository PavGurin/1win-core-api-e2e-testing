import { getTitles, insertTitles } from '../../src/methods/common';
import { checkEmptyTitles, checkTitles, checkTitlesToMatchExpected } from '../../src/expects/exCommon';
import { randomStr } from '../../src/randomizer';


describe('Titles route tests', () => {
  describe('Check params', () => {
    it(' no params', async () => {
      const data = await getTitles();
      // console.log(data);
      expect(data.data).toEqual('Bad Request');
      expect(data.status).toEqual(400);
      expect(data.statusText).toEqual('Bad Request');
      // checkTitles(data);
    });
    it(' path only, russian lang by default', async () => {
      const data = await getTitles({ path: 'cases' });
      // console.log(data);
      checkTitles(data, 'ru', 'cases');
    });
    it(' path + lang', async () => {
      const data = await getTitles({ lang: 'en', path: 'cases' });
      // console.log(data);
      checkTitles(data, 'en', 'cases');
    });
    it(' lang only', async () => {
      const data = await getTitles({ lang: 'en' });
      // console.log(data);
      expect(data.data).toEqual('Bad Request');
      expect(data.status).toEqual(400);
      expect(data.statusText).toEqual('Bad Request');
      // checkTitles(data);
    });
    it(' path + unexistent lang', async () => {
      const data = await getTitles({ lang: 'test', path: 'cases' });
      // console.log(data);
      checkEmptyTitles(data);
    });
    it(' unexistent path + lang', async () => {
      const data = await getTitles({ lang: 'ru', path: 'test' });
      // console.log(data);
      checkEmptyTitles(data);
    });
  });
  describe('Insert titles into DB and find them', () => {
    /* eslint object-curly-newline: off */
    const rnd = randomStr(10);
    const path = `testpath_${rnd}`;
    const titles = [{ lang: 'ru', path, text: `текст ${rnd}`, isDynamic: 0 },
      { lang: 'en', path, text: `text ${rnd}`, isDynamic: 0 },
      { lang: 'de', path, text: `de text ${rnd}`, isDynamic: 0 },
      { lang: 'de', path, text: `de text 2 ${rnd}`, isDynamic: 0 },
      { lang: 'ru', path, text: `текст 2 ${rnd}`, isDynamic: 1 },
      { lang: 'ru', path, text: `текст 3 ${rnd}`, isDynamic: 1 },
      { lang: 'en', path, text: `text 2 ${rnd}`, isDynamic: 1 },
      { lang: 'fr', path, text: `fr text  ${rnd}`, isDynamic: 1 }];
    beforeAll(async () => {
      await insertTitles(titles);
    });

    it(' lang = ru', async () => {
      const data = await getTitles({ lang: 'ru', path: `testpath_${rnd}` });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'ru'));
    });
    it(' lang = en', async () => {
      const data = await getTitles({ lang: 'en', path: `testpath_${rnd}` });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'en'));
    });
    it(' lang = fr', async () => {
      const data = await getTitles({ lang: 'fr', path: `testpath_${rnd}` });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'fr'));
    });
    it(' lang = de', async () => {
      const data = await getTitles({ lang: 'de', path: `testpath_${rnd}` });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'de'));
    });
    it(' lang not specified', async () => {
      const data = await getTitles({ path: `testpath_${rnd}` });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'ru'));
    });
  });
});
