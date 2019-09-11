import { expect } from 'chai';

describe('Health checker ms-bets light', () => {
  it('light', async () => {
    const data = await socket.send('BETS:-health');
    // console.log(data);
    expect(data.status).equal(200);
    expect(data.data).equal('OK');
  });
});
