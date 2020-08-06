import { checkEmptyTitles, checkTitles } from '../../src/expects/exCommon';
import { mysqlConnection } from '../../src/methods/mysqlConnection';
import { randomStr } from '../../src/randomizer';

const axios = require('axios');

async function getTitles(params) {
  try {
    const { data } = await axios.get('https://master_staging.staging.1win-prodlike.tech/common2/titles/all', {
      params,
    });
    return data;
  } catch (e) {
    return { data: e.response.data, status: e.response.status, statusText: e.response.statusText };
  }
}
async function insertTitles(titlesArray) {
  const [res] = await mysqlConnection.executeQuery('select id from 1win.test_ma_titles order by id desc limit 1');
  const titles = [];
  let i = 1;
  titlesArray.forEach(async (title) => {
    try {
      await mysqlConnection.executeQuery(`insert into 1win.test_ma_titles(lang, path, text, is_dynamic)
  values('${title.lang}', '${title.path}', '${title.text}', '${title.isDynamic}');`);
      titles.push({ id: res.id + i, ...title });
      i++;
    } catch (e) {
      console.log(e);
    }
  });
  return titles;
}

// TODO таблица test_ma_titles? (перименовать?)
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
    let titlesInDB;
    const rnd = randomStr(10);
    const titles = [{ lang: 'ru', path: `testpath_${rnd}`, text: `текст ${rnd}`, isDynamic: 0 },
      { lang: 'en', path: `testpath_${rnd}`, text: `text ${rnd}`, isDynamic: 0 },
      { lang: 'fr', path: `testpath_${rnd}`, text: `frtext ${rnd}`, isDynamic: 0 },
      { lang: 'ru', path: `testpath2_${rnd}`, text: `текст 2 ${rnd}`, isDynamic: 1 },
      { lang: 'en', path: `testpath2_${rnd}`, text: `text 2 ${rnd}`, isDynamic: 1 },
      { lang: 'fr', path: `testpath2_${rnd}`, text: `frtext 2 ${rnd}`, isDynamic: 1 }];
    beforeAll(async () => {
      titlesInDB = await insertTitles(titles);
    });

    afterAll(async () => {
      titlesInDB.forEach(async (title) => {
        await mysqlConnection.executeQuery(`delete from 1win.test_ma_titles where id = ${title.id}`);
      });
    });
    it(' all', async () => {
      const { data } = await getTitles();
      console.log(data);
      console.log(titlesInDB);
      // checkTitles(data);
    });
  });
});
