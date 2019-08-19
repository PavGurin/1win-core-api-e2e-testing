import { expect } from 'chai';

describe('Health checker ms-user light', () => {
  it('light', async () => {
    const user = await socket.send('USER:-health');
    // console.log(user);
    expect(user.status).equal(200);
    expect(user.data).equal('OK');
  });
});
