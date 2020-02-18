import { getDateDaysAgo } from '../../src/methods/utils';
import { checkResultsByDate } from '../../src/expects/exResults';
import { checkErrMsg } from '../../src/responseChecker';

describe('Results with date filtration', () => {
  it('C1789530 - (-) no date and no time filtration', async () => {
    const { data } = await socket.send('RESULT:results-all', {
      timeFilter: {
        date: false,
        hoursToStart: false,
      },
    });

    checkErrMsg(data, 400, 'Bad request, timeFilter[date] is invalid');
  });

  it('C1789531 - (-) date and time filtration', async () => {
    const date = getDateDaysAgo(2);
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
