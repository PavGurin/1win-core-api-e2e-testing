import { expect } from 'chai';
import { getFormattedDate } from '../../src/methods/utils';

describe('Results', () => {
  it(' - (+) results with date filtration', async () => {
    // for (let i = 0; i <= 6; i++) {
    const date = getFormattedDate();
    // eslint-disable-next-line no-await-in-loop
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date,
        hoursToStart: false,
      },
    });
    // console.log(data);
    expect(data).to.be.an('object');
  });
});
