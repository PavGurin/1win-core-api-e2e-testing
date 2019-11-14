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
    expect(data['0'].count).not.toBeNull();
  });
});
