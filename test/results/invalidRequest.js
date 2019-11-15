import { getDateDaysAgo, getDateHoursAgo } from '../../src/methods/utils';
import { checkResultsByDate, checkResultsByTime } from '../../src/expects/exResults';

describe('Results with date filtration', () => {
  it('C650507 - (-) no date and no time filtration', async () => {
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: false,
      },
    });

    expect(JSON.stringify(data)).toEqual('{}');
  });

  it.skip('C650508 - (-) date and time filtration', async () => {
    const date = getDateDaysAgo(2);
    const hours = getDateHoursAgo(24 * 2 + 4);
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: date.formatted,
        hoursToStart: 4,
      },
    });
    // console.log(data);

    checkResultsByDate(data, date.timestamp);
  });
});
