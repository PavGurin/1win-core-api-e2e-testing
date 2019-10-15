import { expect } from 'chai';

describe('Health checker', () => {
  it(' - Categories-all', async () => {
    const { data } = await socket.send('CASINO-3:categories-all', {});
    // console.log(data[0]);
    expect(data['0'].count).not.equal(null);
  });
});
