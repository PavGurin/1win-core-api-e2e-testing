import {expect} from 'chai';

describe('Offers', () => {
  it('C21140 - (+) valid request offer 1', async () => {
    const {data} = await socket.send('COMMON:offer-1', {});

    // console.log(data);
    expect(data).to.be.an('object');
  });

  it('C21141 - (+) valid request offer 2', async () => {
    const {data} = await socket.send('COMMON:offer-2', {});

    // console.log(data);
    expect(data).to.be.an('object');
  });

  it('C21142 - (+) valid request offer 3', async () => {
    const {data} = await socket.send('COMMON:offer-3', {});

    // console.log(data);
    expect(data).to.be.an('object');
  });
});
