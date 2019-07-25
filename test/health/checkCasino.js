import { expect } from 'chai';

describe('Casino search check', () => {
  it('C20487 - Games-search', async () => {
    const { data } = await socket.send('CASINO-2:games-search', {});

    // console.log(data[0]);
    expect(data['0'].provider).equal('casino');
  });
});
