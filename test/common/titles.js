import { getTitles, insertTitles } from '../../src/methods/common';
import { checkEmptyTitles, checkTitles, checkTitlesToMatchExpected } from '../../src/expects/exCommon';
import { randomStr } from '../../src/randomizer';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { sleep } from '../../src/methods/utils';


describe('Titles route tests', () => {
  describe('Check params', () => {
    it('C2190635 (-) no params', async () => {
      const data = await getTitles();
      // console.log(data);
      expect(data.data).toEqual('Bad Request');
      expect(data.status).toEqual(400);
      expect(data.statusText).toEqual('Bad Request');
      // checkTitles(data);
    });
    it('C2190636 (+) path only, russian lang by default', async () => {
      const data = await getTitles({ path: 'cases' });
      // console.log(data);
      checkTitles(data, 'ru', 'cases');
    });
    it('C2190637 (+) path + lang', async () => {
      const data = await getTitles({ lang: 'en', path: 'cases' });
      // console.log(data);
      checkTitles(data, 'en', 'cases');
    });
    it('C2190638 (-) lang only', async () => {
      const data = await getTitles({ lang: 'en' });
      // console.log(data);
      expect(data.data).toEqual('Bad Request');
      expect(data.status).toEqual(400);
      expect(data.statusText).toEqual('Bad Request');
      // checkTitles(data);
    });
    it('C2190639 (-) path + unexistent lang', async () => {
      const data = await getTitles({ lang: 'test', path: 'cases' });
      // console.log(data);
      checkEmptyTitles(data);
    });
    it('C2190640 (-) unexistent path + lang', async () => {
      const data = await getTitles({ lang: 'ru', path: 'test' });
      // console.log(data);
      checkEmptyTitles(data);
    });
  });
  describe('Insert titles into DB and get them in request', () => {
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
    afterAll(async () => {
      await sleep(5000);
      await mysqlConnection.executeQuery(`delete from 1win.ma_titles where path = '${path}';`);
    });

    it('C2190641 (+) lang = ru', async () => {
      const data = await getTitles({ lang: 'ru', path });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'ru'));
    });
    it('C2190642 (+) lang = en', async () => {
      const data = await getTitles({ lang: 'en', path });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'en'));
    });
    it('C2190643 (+) lang = fr', async () => {
      const data = await getTitles({ lang: 'fr', path });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'fr'));
    });
    it('C2190644 (+) lang = de', async () => {
      const data = await getTitles({ lang: 'de', path });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'de'));
    });
    it('C2190645 (+) lang not specified', async () => {
      const data = await getTitles({ path });
      // console.log(data);
      checkTitlesToMatchExpected(data, titles.filter(title => title.lang === 'ru'));
    });
    it('C2190646 (-) lang not present in db for this path', async () => {
      const data = await getTitles({ lang: 'ua', path });
      // console.log(data);
      checkEmptyTitles(data);
    });
  });
});
