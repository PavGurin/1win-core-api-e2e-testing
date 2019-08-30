import { expect } from 'chai';

describe('Games-block', () => {
  it('C21139 - (+) valid request', async () => {
    const { data } = await socket.send('COMMON:casino-widget', {

      games: ['spacewars_not_mobile_sw', 'bigbadwolf'],
      categories: [33, 41],
    });

    console.log(data);
    expect(data['0'].hasDemo).not.equal(null);
  });
});
