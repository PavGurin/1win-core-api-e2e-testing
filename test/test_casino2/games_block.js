import { expect } from 'chai';

describe('Games-block', () => {
  it('C21139 - (+) valid request', async () => {
    const { data } = await socket.send('CASINO-2:games-block', {

      games: ['spacewars_not_mobile_sw', 'bigbadwolf'],
      categories: [],
    });

    console.log(data);
    expect(data['0'].hasDemo).not.equal(null);
  });
});
