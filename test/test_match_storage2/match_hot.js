import { expect } from 'chai';

describe('Match hot', () => {
  it('C21145 - Match hot', async () => {
    const { data } = await socket.send('MATCH-STORAGE-2:match-hot', {
      service: 'prematch',
      timeFilter: {
        date: false,
        hour: false,
      },
    });

    // console.log(data);
    expect(data.service).equal('prematch');
  });
});
