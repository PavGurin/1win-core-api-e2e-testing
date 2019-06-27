import {expect} from 'chai';

describe('Widgets 1', () => {
  it('C21143 - (+) valid request', async () => {
    const {data} = await socket.send('COMMON:widgets-1', {

      matchId: '-1',
    });

    // console.log(data);
    expect(data.status).equal(404);
    expect(data.message).equal('Widget with ID 1 not found');
  });
});
