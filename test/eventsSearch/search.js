import { search } from '../../src/methods/search';
import { checkErrMsg } from '../../src/responseChecker';
import { checkSearchResults } from '../../src/expects/exSearch';

describe('Events search tests', () => {
  describe('Lang = ru', () => {
    it('C2011336 (+) Valid response', async () => {
      const { data } = await search('ru', 'испания');
      // console.log(data);
      expect(data.status).toEqual(200);
      expect(data.data.tournaments).toBeArray();
      expect(data.data.matches).toBeObject();
    });

    it('C2011337 (+) Search match', async () => {
      const word = 'манчестер';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, true, false);
    });

    it('C2011338 (+) Search tournament', async () => {
      const word = 'кубок';
      const { data: { data } } = await search('ru', word);
      // console.log(data);
      checkSearchResults(data, word, false, true);
    });

    it('C2011339 (+) Searched substring both in match and in tournament', async () => {
      const word = 'клуб';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, true, true);
    });

    it('C2011340 (-) Nothing found', async () => {
      const word = 'абвгдежз';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, false, false);
    });

    it('C2011341 (+) Search english word with russian language', async () => {
      const word = 'league';
      const { data: { data } } = await search('ru', word);
      // console.log(data);
      checkSearchResults(data, word, false, true);
    });

    it('C2011342 (+) Search number', async () => {
      const word = '1';
      const { data: { data } } = await search('ru', word);
      // console.log(data);
      checkSearchResults(data, word, true, true);
    });

    it('C2012371 (-) Search only symbol', async () => {
      const word = '.';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, false, false);
    });

    it('C2012372 (+) Search letter + symbol', async () => {
      const word = 'а,';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, true, true);
    });

    it('C2012373 (-) Empty search', async () => {
      const word = '';
      const { data } = await search('ru', word);
      // console.log(data);
      checkErrMsg(data, 500, '400'); // wtf?
    });

    it('C2012374 (-) Long search substring', async () => {
      const word = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, false, false);
    });

    it('C2012375 (+) Search space', async () => {
      const word = ' ';
      const { data: { data } } = await search('ru', word);
      checkSearchResults(data, word, true, true);
    });

    it('C2012376 (+) Search does not depend on upper/lower case', async () => {
      const word1 = 'лига';
      const word2 = 'ЛИГА';

      const { data: { data: data1 } } = await search('ru', word1);
      const { data: { data: data2 } } = await search('ru', word2);

      expect(data1).toEqual(data2);
    });

    it('C2012377 (+) Space at the end of search substring is not deleted', async () => {
      const word1 = 'лига';
      const word2 = 'лига ';

      const { data: { data: data1 } } = await search('ru', word1);
      const { data: { data: data2 } } = await search('ru', word2);

      expect(data1).not.toEqual(data2);
    });

    it('C2016489 (+) Search by part of word', async () => {
      const word = 'ити';
      const regex = RegExp(`(.*[а-яёA-Я]+(?! )${word}.*|.*${word}(?! )[а-яёA-Я]+)|.*[а-яёA-Я]+${word}[а-яёA-Я]+.*`);
      const { data: { data } } = await search('ru', word);
      // console.log(data);
      expect(data.tournaments
        .some(tournament => regex.test(tournament.tournamentName.ru.toLowerCase()))
        || Object.values(data.matches)
          .some(match => regex.test(match[0].awayTeamName.ru.toLowerCase())
            || regex.test(match[0].homeTeamName.ru.toLowerCase()))).toEqual(true);
    });

    it('C2019923 (+) Search live', async () => {
      const word = 'а';
      const service = 'live';
      const { data: { data } } = await search('ru', word, service);
      checkSearchResults(data, word, true, true, 'ru', service);
    });

    it('C2019924 (+) Search prematch', async () => {
      const word = 'клуб';
      const service = 'prematch';
      const { data: { data } } = await search('ru', word, service);
      checkSearchResults(data, word, true, true, 'ru', service);
    });

    it('C2019925 (-) Search with invalid service', async () => {
      const word = 'клуб';
      const service = 'prematch';
      const { data: { data } } = await search('ru', word, 'sadfsadf');
      // console.log(data);
      checkSearchResults(data, word, false, false, 'ru');
    });
  });

  describe('Lang = en', () => {
    it('C2012378 (+) Valid response', async () => {
      const { data } = await search('en', 'spain');
      // console.log(data);
      expect(data.status).toEqual(200);
      expect(data.data.tournaments).toBeArray();
      expect(data.data.matches).toBeObject();
    });

    it('C2012379 (+) Search match', async () => {
      const word = 'manchester';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, true, false, 'en');
    });

    it('C2012380 (+) Search tournament', async () => {
      const word = 'league';
      const { data: { data } } = await search('en', word);
      // console.log(data);
      checkSearchResults(data, word, false, true, 'en');
    });

    it('C2012381 (+) Searched substring both in match and in tournament', async () => {
      const word = 'club';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, true, true, 'en');
    });

    it('C2012382 (-) Nothing found', async () => {
      const word = 'abcdef';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, false, false, 'en');
    });

    it('C2012383 (-) Search russian word with english language', async () => {
      const word = 'лига';
      const { data: { data } } = await search('en', word);
      // console.log(data);
      checkSearchResults(data, word, false, false, 'en');
    });

    it('C2012384 (+) Search number', async () => {
      const word = '1';
      const { data: { data } } = await search('en', word);
      // console.log(data);
      checkSearchResults(data, word, true, true, 'en');
    });

    it('C2012385 (-) Search only symbol', async () => {
      const word = '.';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, false, false, 'en');
    });

    it('C2012386 (+) Search letter + symbol', async () => {
      const word = 'league,';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, false, true, 'en');
    });

    it('C2012387 (-) Empty search', async () => {
      const word = '';
      const { data } = await search('en', word);
      // console.log(data);
      checkErrMsg(data, 500, '400'); // wtf?
    });

    it('C2012388 (-) Long search substring', async () => {
      const word = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, false, false, 'en');
    });

    it('C2012389 (+) Search space', async () => {
      const word = ' ';
      const { data: { data } } = await search('en', word);
      checkSearchResults(data, word, true, true, 'en');
    });

    it('C2012390 (+) Search does not depend on upper/lower case', async () => {
      const word1 = 'league';
      const word2 = 'LEAGUE';

      const { data: { data: data1 } } = await search('en', word1);
      const { data: { data: data2 } } = await search('en', word2);

      expect(data1).toEqual(data2);
    });

    it('C2012391 (+) Space at the end of search substring is not deleted', async () => {
      const word1 = 'league';
      const word2 = 'league ';

      const { data: { data: data1 } } = await search('en', word1);
      const { data: { data: data2 } } = await search('en', word2);

      expect(data1).not.toEqual(data2);
    });

    it('C2016488 (+) Search by part of word', async () => {
      const word = 'ity';
      const regex = RegExp(`(.*[a-zA-Z]+(?! )${word}.*|.*${word}(?! )[a-zA-Z]+)|.*[a-zA-Z]+${word}[a-zA-Z]+.*`);
      const { data: { data } } = await search('en', word);
      // console.log(data);
      expect(data.tournaments
        .some(tournament => regex.test(tournament.tournamentName.ru.toLowerCase()))
        || Object.values(data.matches)
          .some(match => regex.test(match[0].awayTeamName.ru.toLowerCase())
            || regex.test(match[0].homeTeamName.ru.toLowerCase()))).toEqual(true);
    });

    it('C2019926 (+) Search live', async () => {
      const word = 'a';
      const service = 'live';
      const { data: { data } } = await search('en', word, service);
      checkSearchResults(data, word, true, true, 'en', service);
    });

    it('C2019927 (+) Search prematch', async () => {
      const word = 'club';
      const service = 'prematch';
      const { data: { data } } = await search('en', word, service);
      checkSearchResults(data, word, true, true, 'en', service);
    });

    it('C2019928 (-) Search with invalid service', async () => {
      const word = 'club';
      const { data: { data } } = await search('en', word, 'sadfsadf');
      // console.log(data);
      checkSearchResults(data, word, false, false);
    });
  });

  it('C2019922 (-) Search with invalid lang', async () => {
    const word = 'league';
    const { data } = await search('qweqwe', word);
    // console.log(data);
    checkErrMsg(data, 500, '400'); // wtf?
  });
});
