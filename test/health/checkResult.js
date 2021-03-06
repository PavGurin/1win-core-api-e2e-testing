import { getDateDaysAgo } from '../../src/methods/utils';

describe('Results', () => {
  it(' - (+) results with date filtration', async () => {
    // for (let i = 0; i <= 6; i++) {
    const date = getDateDaysAgo();
    // eslint-disable-next-line no-await-in-loop
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
        hoursToStart: false,
      },
    });
    // console.log(data);
    expect(data).toBeObject();
  });
});
