import { expect } from 'chai';
import { checkErrMsg } from '../../src/responseChecker';

describe('Casino search check', () => {
  it('C20487 - Games-search', async () => {
    const { data } = await socket.send('CASINO-3:games-search', {});

    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, text is required, no default value provided');
  });


  it('C20488 - Categories-all', async () => {
    const { data } = await socket.send('CASINO-3:categories-all', {});
    // console.log(data[0]);
    expect(data['0'].count).not.equal(null);
  });


  // FIXME не знаю почему падает этот тест, не разбиралась
  it('C20489 - Games-all', async () => {
    const { data } = await socket.send('CASINO-3:games-all', {
      limit: [0, 1000],
      where: {},
      lang: 'ru',
      isOnlyMobile: false,
    });
    // console.log(data[0]);
    expect(data['0'].id).not.equal(null);
  });
});
