import { checkErrMsg } from '../../src/responseChecker';

describe('Casino games search', () => {
  it('C20487 - Search a game with empty text field', async () => {
    const { data } = await socket.send('CASINO-3:games-search', {});

    // console.log(data);
    checkErrMsg(data, 400, 'Bad request, text is required, no default value provided');
  });

  it('C20488 - Get all categories', async () => {
    const { data } = await socket.send('CASINO-3:categories-all', {});
    // console.log(data[0]);
    expect(data['0'].count).not.toBeNull();
  });

  it('C1601221 - Search a game with a empty text', async () => {
    const { data } = await socket.send('CASINO-3:games-search', {
      text: '',
      ownerName: 'Elk',
    });
    // console.log(data);

    expect(data.status).toEqual(400);
    expect(data.message).toEqual('Bad request, text is invalid');
  });

  it('C1601222 - Search game with spaces in text field ', async () => {
    const { data } = await socket.send('CASINO-3:games-search', {
      text: ' ',
      ownerName: 'Elk',
    });
    // console.log(data);
  });

  it('C1601220 - Search game with provider name ', async () => {
    const { data } = await socket.send('CASINO-3:games-search', {
      text: 'Elk',
    });
    // console.log(data);
  });
});
